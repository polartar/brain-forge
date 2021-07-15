import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'

import { TreeSelect } from 'antd'
import { debounce, each, find, filter, first, get, isEmpty, last, map, toInteger } from 'lodash'

const LABEL_MAP = {
  site: 'full_name',
  pi: 'username',
  study: 'full_name',
  scanner: 'full_name',
  subject: 'anon_id',
  session: 'segment_interval',
  series: 'label',
  datafile: 'name',
}
const DATAFILE_PARENTS = [
  'site_info',
  'pi_info',
  'study_info',
  'scanner_info',
  'subject_info',
  'session_info',
  'series_info',
]

class AnalysisOutputTree extends Component {
  static propTypes = {
    analyses: PropTypes.array,
    disabled: PropTypes.bool,
    initialValue: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        analysis: PropTypes.number,
        file: PropTypes.string,
      }),
    ]),
    multiple: PropTypes.bool,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    multiple: false,
    disabled: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      treeData: [],
      expandedKeys: [],
      selectedKeys: [],
    }

    this.handleSearch = debounce(this.handleSearch, 500)
  }

  componentDidMount() {
    const { analyses, initialValue } = this.props

    this.loadAnalyses(analyses, initialValue)
  }

  componentWillReceiveProps(nextProps) {
    const { analyses, initialValue } = this.props
    const { selectedKeys } = this.state

    if (initialValue !== nextProps.initialValue && isEmpty(selectedKeys)) {
      this.loadAnalyses(analyses, nextProps.initialValue)
    }
  }

  createNode = (treeData, fieldToLoad, elem, parentId) => {
    const isLeaf = fieldToLoad === 'file'
    const isAnalysis = fieldToLoad === 'analysis'

    const elemId = isLeaf ? elem.id : `${fieldToLoad}-${elem.id}`
    const existedNode = find(treeData, { id: elemId })

    if (existedNode) {
      return existedNode
    }

    const node = {
      id: elemId,
      title: elem.name || elem[LABEL_MAP[fieldToLoad]],
      pId: parentId,
      value: elem.value || elemId,
      field: fieldToLoad,
      dataId: elem.id,
      isLeaf,
      isAnalysis,
    }
    treeData.push(node)

    return node
  }

  loadAnalyses = (analyses, initialValue = null) => {
    let nodes = [...this.state.treeData]

    analyses.forEach(analysis => {
      let parentNode = { id: 0 }

      DATAFILE_PARENTS.forEach(fieldName => {
        const fieldToLoad = fieldName.replace('_info', '')
        parentNode = this.createNode(nodes, fieldToLoad, analysis.input_file[fieldName], parentNode.id)
      })

      parentNode = this.createNode(nodes, 'analysis', analysis, parentNode.id)
    })

    const toExpandedNodes = filter(nodes, { isAnalysis: false, isLeaf: false })

    this.setState({ treeData: nodes, expandedKeys: map(toExpandedNodes, 'id') }, initialValue && this.setInitialValue)
  }

  setInitialValue = () => {
    const { initialValue, multiple } = this.props
    const { treeData, expandedKeys, selectedKeys } = this.state
    const initValues = multiple ? initialValue : [initialValue]
    let nodes = [...treeData]
    let newExpandedKeys = [...expandedKeys]
    let newSelectedKeys = [...selectedKeys]

    initValues.forEach(initValue => {
      const selectedAnalysis = find(nodes, { isAnalysis: true, dataId: initValue.analysis })

      if (selectedAnalysis) {
        newExpandedKeys.push(selectedAnalysis.id)
        newSelectedKeys.push(`${initValue.analysis}-${initValue.file}`)
      }
    })
    this.setState({ expandedKeys: newExpandedKeys, selectedKeys: newSelectedKeys })
  }

  handleNodeSelect = (_, node) => {
    const { expandedKeys } = this.state

    this.setState({
      expandedKeys: node.props.expanded
        ? expandedKeys.filter(key => key !== node.props.eventKey)
        : expandedKeys.concat(node.props.eventKey),
    })
  }

  handleTreeChange = value => {
    const { multiple } = this.props

    const newSelectedKeys = multiple ? value : [value]
    this.setState({ selectedKeys: newSelectedKeys })

    const selectedValues = map(newSelectedKeys, key => {
      const [analysisId, file] = key.split('-')
      return { analysis: toInteger(analysisId), file }
    })

    this.props.onChange(multiple ? selectedValues : first(selectedValues))
  }

  handleTreeExpand = value => {
    const { treeData } = this.state
    const lastExpandedKey = last(value)
    const expandedNode = find(treeData, { id: lastExpandedKey })

    if (expandedNode.isAnalysis) {
      this.loadOutputFiles(expandedNode)
    }

    this.setState({ expandedKeys: value })
  }

  loadOutputFiles = nodeProps => {
    const analysisId = nodeProps.dataId
    const url = `/analysis/${analysisId}/output/`
    let nodes = [...this.state.treeData]

    axios.get(url).then(res => {
      const { data } = res
      const files = get(data, 'all_files')

      if (files) {
        files.forEach(file => {
          this.createNode(nodes, 'file', { id: `${analysisId}-${file}`, name: file }, nodeProps.id)
        })
        this.setState({ treeData: nodes })
      }
    })
  }

  handleSearch = value => {
    const { analyses } = this.props

    if (isEmpty(value)) {
      this.loadAnalyses(analyses)
    } else {
      const url = `/analysis-output/?all_files=${value}`

      axios.get(url).then(res => {
        let nodes = [...this.state.treeData]

        each(res.data, analysis => {
          const filteredFiles = filter(analysis.output_result.all_files, file => file.includes(value))
          each(filteredFiles, file => {
            const parentNode = find(nodes, { field: 'analysis', dataId: analysis.id })

            if (parentNode) {
              this.createNode(nodes, 'file', { id: `${analysis.id}-${file}`, name: file }, parentNode.id)
            }
          })
        })

        const toExpandedNodes = filter(nodes, { isLeaf: false })
        this.setState({ treeData: nodes, expandedKeys: map(toExpandedNodes, 'id') })
      })
    }
  }

  render() {
    const { multiple, disabled } = this.props
    const { selectedKeys, expandedKeys, treeData } = this.state

    return (
      <TreeSelect
        treeDataSimpleMode
        showSearch
        value={selectedKeys}
        treeCheckable={multiple}
        treeExpandedKeys={expandedKeys}
        style={{ width: '100%' }}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select output files"
        treeData={treeData}
        allowClear
        multiple={multiple}
        disabled={disabled}
        filterTreeNode={false}
        onSelect={this.handleNodeSelect}
        onChange={this.handleTreeChange}
        onTreeExpand={this.handleTreeExpand}
        onSearch={this.handleSearch}
      />
    )
  }
}

export default AnalysisOutputTree
