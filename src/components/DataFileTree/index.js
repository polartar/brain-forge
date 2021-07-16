import React, { useEffect, useState, useCallback } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import qs from 'qs'
import { Button, TreeSelect, Spin, Switch } from 'antd'
import {
  debounce,
  find,
  filter,
  first,
  get,
  has,
  isEmpty,
  isInteger,
  isArray,
  last,
  map,
  values,
  uniqBy,
  uniq,
  zipWith,
} from 'lodash'
import { stringify } from 'query-string'
import { ANALYSIS_ALLOWED_FILE_TYPES, MAX_SELECT_FILES } from 'config/base'
import { arrayMove } from 'utils/common'
import SortTable from './SortTable'

const LOAD_MAP = {
  init: 'site',
  site: 'pi',
  pi: 'study',
  study: 'subject',
  subject: 'session',
  session: 'series',
  series: 'datafile',
}
const LABEL_MAP = {
  site: 'full_name',
  pi: 'username',
  study: 'full_name',
  subject: 'anon_id',
  session: 'segment_interval',
  series: 'label',
  datafile: 'name',
}
const DATAFILE_PARENTS = ['site_info', 'pi_info', 'study_info', 'subject_info', 'session_info', 'series_info']

export const DataFileTree = props => {
  const { debounceDelay, dataOrder, multiple, disabled } = props

  let axiosCancelSource
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [tableSwitched, setTableSwitched] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    page: 1,
  })

  const dropdownClassName = `datafile-dropdown-${props.name}`
  const querySelector = document.querySelector(`.${dropdownClassName}`)

  const isSearching = !isEmpty(searchValue)
  const debouncedSearch = useCallback(debounce((value, page) => handleSearch(value, page), debounceDelay), [
    expandedKeys,
  ])

  useEffect(() => {
    axiosCancelSource = axios.CancelToken.source()
  })

  useEffect(() => {
    if (!isEmpty(searchValue)) {
      debouncedSearch(searchValue, 1)
    }
  }, [searchValue])

  useEffect(() => {
    setInitialValue(props.initialValue)
  }, [])

  useEffect(() => {
    const { initialValue } = props

    if (isEmpty(selectedKeys)) {
      setInitialValue(initialValue)
    }
  }, [props.initialValue])

  useEffect(() => {
    querySelector && querySelector.addEventListener('scroll', handleScroll)

    return () => {
      querySelector && querySelector.removeEventListener('scroll', handleScroll)
    }
  })

  useEffect(() => {
    if (!isEmpty(dataOrder)) {
      const treeDataSort = sortData([...treeData], true)
      setTreeData(treeDataSort)
    }
  }, [dataOrder])

  const setInitialValue = async initialValue => {
    const { analysis, multiple, onUpdateFields } = props
    let inputFiles

    if (isInteger(initialValue)) {
      // Scenario 1: if a datafile ID is given. Query this value.
      const res = await getDataFile({ id: initialValue })
      inputFiles = res.data.results
    } else if (isArray(initialValue)) {
      // Scenario 2: if an array is given. This is a list of multiple file inputs.
      inputFiles = initialValue
    } else {
      // Scenario 3: object input file is given.
      inputFiles = [initialValue]
    }

    inputFiles = filter(inputFiles)

    if (isEmpty(inputFiles)) {
      loadData({ props: { field: 'init' } })
    } else {
      const createdNodes = createDataFileNodes(inputFiles)
      const selectedKeys = multiple ? map(createdNodes, 'id') : map(filter(createdNodes, 'isLeaf'), 'id')

      props.onChange(inputFiles)
      unstable_batchedUpdates(() => {
        setSelectedKeys(selectedKeys)
        setSelectedFiles(inputFiles)
      })

      if (get(analysis, 'parameters.file.fields') && onUpdateFields) {
        const inputFile = first(inputFiles)
        onUpdateFields({
          file: inputFile.id,
          fields: analysis.parameters.file.fields,
        })
      }
    }
  }

  const getDataFile = params => {
    return axios.get('/data-file/', {
      params,
      cancelToken: axiosCancelSource.token,
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
  }

  const getAdditionalFilters = () => {
    const { analysisType } = props

    if (!analysisType) {
      return {}
    }

    const allowedFileTypes = ANALYSIS_ALLOWED_FILE_TYPES[analysisType.name] || []

    return {
      files: allowedFileTypes,
      // TODO: modality: analysisType.modality,
    }
  }

  const getFieldToLoad = nodeProps => {
    const { field: currentField } = nodeProps
    return LOAD_MAP[currentField]
  }

  const getAPIUrl = nodeProps => {
    const fieldToLoad = getFieldToLoad(nodeProps)
    const API_URL = `/run-analysis-data/${fieldToLoad}/`

    if (fieldToLoad === 'site') {
      return API_URL
    }

    const additionalFilters = fieldToLoad === 'datafile' ? getAdditionalFilters() : {}
    const queryParam = getQueryParam(nodeProps, additionalFilters)
    return `${API_URL}?${stringify(queryParam)}`
  }

  const getQueryParam = (nodeProps, queryParam) => {
    const [field, id] = nodeProps.value.split(';')
    queryParam[field] = id

    if (field === 'site') {
      return queryParam
    } else {
      const parentNode = find(treeData, { id: nodeProps.pId })

      return parentNode ? getQueryParam(parentNode, queryParam) : queryParam
    }
  }

  const sortBy = (treeData, dataOrder) => {
    return treeData.sort((a, b) => {
      const aField = map(dataOrder, a.field)
      const bField = map(dataOrder, b.field)

      if (!isEmpty(aField) && !isEmpty(bField)) {
        const aIncluded = aField.includes(a.title)
        const bIncluded = bField.includes(b.title)

        if (aIncluded && bIncluded) return aField.indexOf(a.title) - bField.indexOf(b.title)
        if (aIncluded) return -1
        if (bIncluded) return 1
      }
      return a.title.localeCompare(b.title)
    })
  }

  const sortData = (treeData, isLocaleCompare = false) => {
    const { dataOrder } = props

    if (!isEmpty(dataOrder)) {
      return sortBy(treeData, dataOrder)
    } else if (isLocaleCompare) {
      return treeData.sort((a, b) => !isEmpty(a.title) && !isEmpty(b.title) && a.title.localeCompare(b.title))
    } else {
      return treeData.sort(
        (a, b) => !isEmpty(a.title) && !isEmpty(b.title) && last(a.title.split('_')) - last(b.title.split('_')),
      )
    }
  }

  const loadData = async ({ props: nodeProps }) => {
    const url = getAPIUrl(nodeProps)
    try {
      const res = await axios.get(url, { cancelToken: axiosCancelSource.token })
      parseResponse(res.data, nodeProps)
    } catch {}
  }

  const parseResponse = (data, nodeProps) => {
    const fieldToLoad = getFieldToLoad(nodeProps)
    const parentId = get(nodeProps, 'id', 0)
    let newTreeData = [...treeData]

    data.forEach(elem => {
      if (!find(newTreeData, { pId: parentId, value: `${fieldToLoad};${elem.id}` })) {
        const isLeaf = fieldToLoad === last(values(LOAD_MAP))

        if (isLeaf) {
          elem.files.forEach(file => {
            const fileValue = { id: `${elem.id};${file}`, name: file, datafile: elem }
            createNode(newTreeData, fieldToLoad, fileValue, parentId)
          })
        } else {
          createNode(newTreeData, fieldToLoad, elem, parentId)
        }
      }
    })

    const treeDataSort = isSearching ? newTreeData : sortData(newTreeData, true)
    setTreeData(treeDataSort)
  }

  const createNode = (treeData, fieldToLoad, elem, parentId) => {
    if (!elem) return null
    if (fieldToLoad === 'datafile' && elem.name.includes('.json')) return null

    const elemId = `${fieldToLoad};${elem.id}`
    const existedNode = find(treeData, { id: elemId })

    if (existedNode) return { node: existedNode, created: false }
    const isLeaf = fieldToLoad === last(values(LOAD_MAP))

    const title = has(elem, 'sort_order')
      ? `${elem.name}_${get(elem, 'sort_order')}`
      : elem[LABEL_MAP[fieldToLoad]] || elem.name

    const node = {
      id: elemId,
      title,
      pId: parentId,
      value: elem.value || elemId,
      field: fieldToLoad,
      isLeaf: isLeaf,
      elem: isLeaf ? elem.datafile : elem,
    }

    treeData.push(node)

    return { node, created: true }
  }

  const handleScroll = e => {
    const contentHeight = e.target.scrollHeight - e.target.offsetHeight

    if (contentHeight <= e.target.scrollTop) {
      handleLoadMore()
    }
  }

  const createDataFileNodes = datafiles => {
    let nodes = [...treeData]
    let newNodes = []

    datafiles.forEach(elem => {
      let parentNode = { id: 0 }

      DATAFILE_PARENTS.forEach(fieldName => {
        const fieldToLoad = fieldName.replace('_info', '')
        const newNode = createNode(nodes, fieldToLoad, elem[fieldName], parentNode.id)

        if (newNode) {
          parentNode = newNode.node
          newNodes.push(parentNode)
        }
      })

      elem.files &&
        elem.files.forEach(file => {
          const fileValue = { id: `${elem.id};${file}`, name: file, datafile: elem }
          const newNode = createNode(nodes, 'datafile', fileValue, parentNode.id)

          newNode && newNodes.push(newNode.node)
        })
    })

    const mapNewNodes = map(uniq(newNodes), 'id')

    unstable_batchedUpdates(() => {
      setTreeData(nodes)
      setExpandedKeys(uniq(expandedKeys.concat(mapNewNodes)))
    })

    return newNodes
  }

  const handleLoadMore = () => {
    const { page, totalCount, pageSize } = pagination

    // Calculate if there is still more data to load the next page.
    const currentCount = page * pageSize
    if (currentCount < totalCount) {
      debouncedSearch(searchValue, page + 1)
    }
  }

  const handleRowMove = (oldIndex, newIndex) => {
    const sortSelectedFiles = arrayMove(selectedFiles, oldIndex, newIndex)
    const sortOrder = map(sortSelectedFiles, 'subject_info.anon_id')
    const sortTreeData = sortBy(treeData, sortOrder)

    setTreeData(sortTreeData)
    setSelectedFiles([...sortSelectedFiles])
    props.onChange(sortSelectedFiles)
  }

  const handleNodeSelect = (_, node) => {
    const nextExpandedKeys = node.props.expanded
      ? expandedKeys.filter(key => key !== node.props.eventKey)
      : expandedKeys.concat(node.props.eventKey)

    setExpandedKeys(uniq([...expandedKeys, ...nextExpandedKeys]))
  }

  const handleTreeChange = (value, _, extra) => {
    const { multiple } = props

    let newSelectedKeys = multiple ? value : [value]
    const node = extra.triggerNode

    if (isSearching) {
      newSelectedKeys = filter(newSelectedKeys, key => key.toLowerCase().includes(searchValue.toLowerCase()))
    }

    setSelectedKeys(newSelectedKeys)

    const selectedNodes = map(newSelectedKeys, id => find(treeData, { id }))
    const isParentSelected = !isEmpty(newSelectedKeys) && !get(node, 'props.isLeaf')

    if (isParentSelected && !isSearching) {
      if (extra.triggerValue) {
        // Scenario 1: select parent & no search => find, select and expand files tree.
        const [field, id] = extra.triggerValue.split(';')

        // Get filter requirements from analysis type.
        const analysisTypeFilter = getAdditionalFilters()

        getDataFile({ ...analysisTypeFilter, [field]: id, pageSize: MAX_SELECT_FILES }).then(res => {
          if (!isEmpty(get(res, 'data.results'))) {
            const newSelectedNodes = createDataFileNodes(get(res, 'data.results'))
            const allSelectedNodes = uniqBy([...selectedNodes, ...newSelectedNodes], 'id')
            const allSelectedLeafNodes = filter(allSelectedNodes, 'isLeaf')
            const selectedFiles = map(allSelectedLeafNodes, 'elem')

            props.onChange(selectedFiles)
            setSelectedFiles(selectedFiles)
          }
        })
      } else {
        setSelectedKeys([])
        props.onChange([])
      }
    } else {
      // Scenario 2: select leaf nodes or select during search => only select searched files.
      const selectedLeafNodes = filter(selectedNodes, 'isLeaf')
      const selectedFiles = map(selectedLeafNodes, 'elem')

      props.onChange(selectedFiles)
      setSelectedFiles(selectedFiles)
    }
  }

  const handleSearch = async (value, page = 1) => {
    setLoading(true)

    if (isEmpty(value)) {
      loadData({ props: { field: 'init' } })
      setLoading(false)
    } else {
      const res = await getDataFile({ files: value, page })

      if (get(res, 'data.results')) {
        createDataFileNodes(get(res, 'data.results'))
      }

      const pagination = {
        pageSize: get(res, 'data.pageSize'),
        totalCount: get(res, 'data.totalCount'),
        page: get(res, 'data.currentPage'),
      }

      setPagination({ ...pagination })
      setLoading(false)
    }
  }

  const handleSelectDataOrderFile = async () => {
    setLoading(true)

    const { dataOrder } = props
    const dataOrderFiles = map(dataOrder, 'datafile')
    const analysisTypeFilter = getAdditionalFilters()
    const searchPromises = dataOrderFiles.map(datafileName =>
      getDataFile({ ...analysisTypeFilter, name: datafileName, pageSize: MAX_SELECT_FILES }),
    )

    const responses = await Promise.all(searchPromises)
    const results = responses.map(res => get(res, 'data.results'))

    // For each dataOrder row, get the best match search response.
    const searchResult = zipWith(dataOrder, results, (row, rowSearchResponse) => {
      const bestMatch = rowSearchResponse.filter(resultEntry => {
        if (row.subject && row.subject !== resultEntry.subject_info.anon_id) return false
        if (row.session && row.session !== resultEntry.session_info.segment_interval) return false
        if (row.series && row.series !== resultEntry.series_info.label) return false
        return true
      })
      return first(bestMatch)
    })

    const newSelectedNodes = createDataFileNodes(filter(searchResult))
    const allSelectedLeafNodes = filter(newSelectedNodes, 'isLeaf')
    const selectedKeys = map(allSelectedLeafNodes, 'id')
    const selectedFiles = map(allSelectedLeafNodes, 'elem')

    props.onChange(selectedFiles)
    unstable_batchedUpdates(() => {
      setSelectedKeys(selectedKeys)
      setSelectedFiles(selectedFiles)
      setLoading(false)
    })
  }

  const hasDataFileInDataOrder = !isEmpty(get(dataOrder, '0.datafile'))
  const noFileSelected = isEmpty(selectedFiles)

  return (
    <Spin spinning={loading}>
      <div style={{ position: 'relative' }}>
        {hasDataFileInDataOrder && noFileSelected && (
          <Button disabled={loading} value="large" style={{ margin: '10px 0px' }} onClick={handleSelectDataOrderFile}>
            Select file by Metadata
          </Button>
        )}
        {!noFileSelected && (
          <Switch
            checkedChildren="Sort Table"
            unCheckedChildren="Sort Table"
            style={{
              position: 'absolute',
              top: '-31px',
              right: 0,
            }}
            onChange={() => setTableSwitched(!tableSwitched)}
          />
        )}
        {tableSwitched ? (
          <SortTable
            selectedKeys={selectedKeys}
            selectedFiles={selectedFiles}
            onChange={(oldIndex, newIndex) => handleRowMove(oldIndex, newIndex)}
          />
        ) : (
          <>
            {!noFileSelected && (
              <span style={{ marginTop: 30 }} className="items-selected-count">
                {selectedFiles.length} files selected
              </span>
            )}
            <TreeSelect
              onScroll={handleScroll}
              allowClear
              treeDataSimpleMode
              autoClearSearchValue={false}
              showSearch
              searchValue={searchValue}
              treeCheckable={multiple}
              value={selectedKeys}
              treeExpandedKeys={expandedKeys}
              dropdownClassName={dropdownClassName}
              className="w-100"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="Please select"
              treeData={treeData}
              multiple={multiple}
              disabled={disabled}
              onSelect={handleNodeSelect}
              onChange={handleTreeChange}
              onTreeExpand={value => setExpandedKeys(uniq(value))}
              onSearch={value => setSearchValue(value)}
              loadData={loadData}
            />
          </>
        )}
      </div>
    </Spin>
  )
}

const inputFileShape = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string,
  path: PropTypes.string,
  files: PropTypes.array,
})

DataFileTree.propTypes = {
  analysisType: PropTypes.object,
  analysis: PropTypes.object,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  initialValue: PropTypes.oneOfType([PropTypes.array, PropTypes.number, inputFileShape]),
  multiple: PropTypes.bool,
  dataOrder: PropTypes.array,
  onChange: PropTypes.func,
  onUpdateFields: PropTypes.func,
  debounceDelay: PropTypes.number,
}

DataFileTree.defaultProps = {
  name: 'default',
  multiple: false,
  disabled: false,
  dataOrder: [],
  debounceDelay: 300, // 300 ms.
}

export default DataFileTree