import React, { Component, Fragment } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Highlighter from 'react-highlight-words'
import { withSizes } from 'react-sizes'
import { compact, find, first, get, keyBy, map, mapValues, pick, isEmpty } from 'lodash'
import { Link } from 'react-router-dom'
import { Button, Dropdown, Icon, Input, Menu, Modal, Table, Tag, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { FileInfo, ParamView, ProvenanceView, Loader } from 'components'
import { getAnalysis, selectAnalysis } from 'store/modules/analyses'
import { getAnalysisDefaultSorter, getOrderingParam, prepareDownloadResult, renderErrors } from 'utils/analyses'
import { showErrorToast } from 'utils/common'
import { ANALYSIS_TYPES, ANALYSIS_STATES, BREAKPOINTS } from 'config/base'

const { Item: MenuItem } = Menu

export class TaskList extends Component {
  static propTypes = {
    analysisTypes: PropTypes.array,
    analysis: PropTypes.object,
    analyses: PropTypes.shape({
      pageSize: PropTypes.number,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number,
      results: PropTypes.array,
    }),
    analysisUsers: PropTypes.array,
    selection: PropTypes.bool,
    studies: PropTypes.array,
    type: PropTypes.string,
    user: PropTypes.object,
    shared: PropTypes.bool,
    loading: PropTypes.bool,
    isDesktop: PropTypes.bool,
    isNotXLScreen: PropTypes.bool,
    fetchData: PropTypes.func,
    deleteAnalysis: PropTypes.func,
    getAnalysis: PropTypes.func,
  }

  static defaultProps = {
    loading: false,
    type: ANALYSIS_STATES.completed.name,
  }

  constructor(props) {
    super(props)

    this.state = {
      paramsModal: false,
      provenanceModal: false,
      inputsModal: false,
      errorModal: false,
      selected: null,
      pagination: null,
      sorter: getAnalysisDefaultSorter(props.type, false),
      downloadingAnalysis: null,
      filters: {},
      searchText: '',
      searchedColumn: '',
      selectedRowKeys: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setPagination(nextProps)
  }

  setPagination = props => {
    const { currentPage, pageSize, totalCount } = props.analyses
    const pagination = { current: currentPage, pageSize, total: totalCount }

    this.setState({ pagination })
  }

  toggleModal = (key, id) => {
    const { analysis } = this.props
    const isOpen = !this.state[key]

    this.setState({
      [key]: isOpen,
      ...(id && { selected: id }),
    })

    if (id && isOpen && get(analysis, 'id') !== id) {
      this.props.getAnalysis(id)
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ pagination, filters, sorter: { ...pick(sorter, ['field', 'order']) } }, this.handleFetchData)
  }

  handleFetchData = () => {
    const { shared, type } = this.props
    const { pagination, sorter, filters } = this.state
    const filterValues = mapValues(filters, filter => get(filter, 0))
    const ordering = getOrderingParam(sorter)

    this.props.fetchData({
      ...filterValues,
      page: pagination.current,
      status: type,
      ordering,
      shared: shared ? 'on' : 'off',
    })
  }

  handleDownloadResult = async id => {
    this.setState({ downloadingAnalysis: id })

    prepareDownloadResult(id)
  }

  handleConfirmDelete = ids => {
    return new Promise((resolve, reject) => {
      ids.forEach(id => this.props.deleteAnalysis(id))

      resolve()
    }).catch(e => showErrorToast(e.toString()))
  }

  handleDeleteResult = (ids, clearSelected = false) => {
    const singularDelete = ids.length === 1
    const titleMsg = singularDelete
      ? `Are you sure want to delete this analysis result?`
      : `Are you sure want to delete these ${ids.length} analyses results?`

    Modal.confirm({
      title: titleMsg,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => {
        const response = this.handleConfirmDelete(ids)
        if (clearSelected) {
          response.then(() => this.setState({ selectedRowKeys: [] }))
        }
        return response
      },
    })
  }

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    this.setState({
      searchText: first(selectedKeys),
      searchedColumn: dataIndex,
    })
  }

  handleSearchReset = clearFilters => {
    clearFilters()
    this.setState({ searchText: '' })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            node && node.focus()
          }}
          className="searchTxt"
          placeholder={`Search ${dataIndex}`}
          value={first(selectedKeys)}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          name="searchBtn"
          className="searchBtn"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="searchoutlined"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button name="resetBtn" onClick={() => this.handleSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  getColumn = (title, key, render) => {
    const { sorter } = this.state
    const { field, order } = sorter

    let column = { title, key, dataIndex: key, sorter: true }

    if (field && order && field === key) {
      column['defaultSortOrder'] = order
    }

    if (render) {
      column['render'] = render
    }

    return column
  }

  get isCompletedAnalyses() {
    const { type } = this.props
    return [
      ANALYSIS_STATES.completed.name,
      ANALYSIS_STATES.success.name,
      ANALYSIS_STATES.error.name,
      ANALYSIS_STATES.all.name,
    ].includes(type)
  }

  get isAllAnalysis() {
    const { type } = this.props
    return type === ANALYSIS_STATES.all.name
  }

  get userColumn() {
    const { analysisUsers } = this.props
    const usersMap = mapValues(keyBy(analysisUsers, 'id'), 'username')
    const column = this.getColumn('User', 'created_by', cell => <span>{usersMap[cell.id]}</span>)

    return {
      ...column,
      filters: map(analysisUsers, user => ({ text: user.username, value: user.id })),
      filterMultiple: false,
    }
  }

  get studyColumn() {
    const { studies } = this.props

    const column = this.getColumn('Study', 'study', (_, record) => (
      <Tooltip title={get(record, 'input_file.study_info.full_name')}>
        <Link to={`/study/${get(record, 'input_file.study_info.id')}`}>
          <Button type="link" className="p-0">
            {record.study_label}
          </Button>
        </Link>
      </Tooltip>
    ))

    return {
      ...column,
      filters: map(studies, study => ({ text: study.label, value: study.id })),
      filterMultiple: false,
    }
  }

  get nameColumn() {
    const column = this.getColumn('Name', 'name', (_, record) => record.name)

    return {
      ...this.getColumnSearchProps('name'),
      ...column,
    }
  }

  get descriptionColumn() {
    return {
      ...this.getColumn('Description', 'description'),
      ...this.getColumnSearchProps('description'),
    }
  }

  get analysisTypeColumn() {
    const { analysisTypes } = this.props

    return {
      ...this.getColumn('Analysis Type', 'analysis_type', (_, record) => ANALYSIS_TYPES[record.analysis_type - 1]),
      filters: map(analysisTypes, analysisType => ({ text: analysisType.name, value: analysisType.id })),
      filterMultiple: false,
    }
  }

  get rowSelection() {
    return {
      onSelect: (record, selected, selectedRows) => {
        const analysisIds = map(selectedRows, 'id')

        this.setState({
          selectedRowKeys: analysisIds,
        })
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        const analysisIds = map(selectedRows, 'id')

        this.setState({
          selectedRowKeys: selected ? analysisIds : [],
        })
      },
    }
  }

  get columns() {
    const { isDesktop } = this.props

    let columns = [
      isDesktop && this.getColumn('Id', 'id', cell => <Link to={`/analysis/${cell}`}>{cell}</Link>),
      this.studyColumn,
      isDesktop && this.userColumn,
      this.nameColumn,
      isDesktop && this.descriptionColumn,
      this.analysisTypeColumn,
      this.getColumn('Started', 'date_time_start'),
      this.isCompletedAnalyses && this.getColumn('Completed', 'date_time_end'),
      this.isAllAnalysis && {
        title: 'Status',
        key: 'status',
        render: (_, record) => this.renderTag(record),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => this.renderDropdown(record),
      },
    ]

    return compact(columns)
  }

  renderTag = record => {
    const { status } = record
    const TAG_COLOR = {
      Complete: 'green',
      Pending: '',
      Error: 'red',
    }

    return <Tag color={TAG_COLOR[status]}>{status}</Tag>
  }

  renderDropdown = record => {
    const { shared } = this.props
    const { downloadingAnalysis } = this.state

    const { id, status } = record
    const completed = status === 'Complete'
    const failed = status === 'Error'
    const downloading = record.id === downloadingAnalysis

    const menu = (
      <Menu>
        <MenuItem onClick={() => this.toggleModal('inputsModal', id)}>
          <Button type="link" icon="experiment" size="small">
            Inputs
          </Button>
        </MenuItem>
        <MenuItem onClick={() => this.toggleModal('paramsModal', id)}>
          <Button icon="setting" size="small" type="link">
            Parameters
          </Button>
        </MenuItem>
        {completed && (
          <MenuItem>
            <Link to={`/analysis/${id}/result`}>
              <Button type="link" icon="eye" size="small">
                Results
              </Button>
            </Link>
          </MenuItem>
        )}
        {completed && (
          <MenuItem onClick={() => this.handleDownloadResult(id)}>
            <Button type="link" icon="download" size="small" loading={downloading} disabled={downloading}>
              {downloading ? 'Preparing Download' : 'Prepare Download'}
            </Button>
          </MenuItem>
        )}
        {failed && (
          <MenuItem onClick={() => this.toggleModal('errorModal', id)}>
            <Button type="link" icon="exclamation-circle" size="small">
              Errors
            </Button>
          </MenuItem>
        )}
        <MenuItem onClick={() => this.toggleModal('provenanceModal', id)}>
          <Button type="link" icon="cluster" size="small">
            Provenance
          </Button>
        </MenuItem>
        <MenuItem>
          <Link to={`/analysis-start/${record.analysis_type}?analysisId=${record.id}`}>
            <Button type="link" icon="redo" size="small">
              Redo
            </Button>
          </Link>
        </MenuItem>
        {(completed || failed) && !shared && (
          <MenuItem onClick={() => this.handleDeleteResult([id])}>
            <Button type="link" icon="delete" size="small">
              Delete
            </Button>
          </MenuItem>
        )}
      </Menu>
    )

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button size="small" onClick={e => e.preventDefault()}>
          Action <Icon type="down" />
        </Button>
      </Dropdown>
    )
  }

  get data() {
    const { analyses } = this.props
    const { results } = analyses

    return map(results, analysis =>
      Object.assign(
        {},
        {
          ...analysis,
          key: analysis.id,
          date_time_start: moment(analysis.date_time_start).format('M/D/YY HH:mm'),
        },
        analysis.date_time_end &&
          this.isCompletedAnalyses && {
            date_time_end: moment(analysis.date_time_end).format('M/D/YY HH:mm'),
          },
      ),
    )
  }

  get paramViewProps() {
    const { analysisTypes, analysis } = this.props

    const parameters = get(analysis, 'parameters')
    const analysis_type = find(analysisTypes, { id: get(parameters, 'analysis.analysis_type') })
    const label = get(analysis_type, 'label')

    return { ...parameters, label }
  }

  get deleteAnalysesBtn() {
    const { selectedRowKeys } = this.state

    return (
      !isEmpty(selectedRowKeys) && (
        <Button
          name="delete-analyses"
          style={{ float: 'right', marginBottom: '16px', zIndex: '1' }}
          onClick={() => this.handleDeleteResult(selectedRowKeys, true)}
        >
          Delete {selectedRowKeys.length > 1 ? `${selectedRowKeys.length} Analyses` : 'Analysis'}
        </Button>
      )
    )
  }

  render() {
    const { loading, isNotXLScreen, selection, analysis } = this.props
    const { paramsModal, provenanceModal, inputsModal, errorModal, pagination, selected } = this.state

    const getAnalysisSuccess = analysis && analysis.id === selected

    return (
      <Fragment>
        {this.deleteAnalysesBtn}
        <Table
          rowSelection={
            selection
              ? {
                  type: 'checkbox',
                  ...this.rowSelection,
                }
              : null
          }
          columns={this.columns}
          dataSource={this.data}
          size="small"
          loading={loading}
          pagination={{ size: 'large', ...pagination }}
          bordered
          scroll={{ x: isNotXLScreen }}
          onChange={this.handleTableChange}
        />
        <Modal
          title="Parameters"
          visible={paramsModal}
          footer={null}
          onOk={() => this.toggleModal('paramsModal')}
          onCancel={() => this.toggleModal('paramsModal')}
          width={800}
          destroyOnClose
        >
          {getAnalysisSuccess ? <ParamView {...this.paramViewProps} /> : <Loader />}
        </Modal>
        <Modal
          title="Provenance"
          visible={provenanceModal}
          footer={null}
          onOk={() => this.toggleModal('provenanceModal')}
          onCancel={() => this.toggleModal('provenanceModal')}
          width={800}
          destroyOnClose
        >
          {getAnalysisSuccess ? <ProvenanceView {...analysis.provenance} /> : <Loader />}
        </Modal>
        <Modal
          title="Inputs"
          visible={inputsModal}
          footer={null}
          onOk={() => this.toggleModal('inputsModal')}
          onCancel={() => this.toggleModal('inputsModal')}
          width={800}
          destroyOnClose
        >
          {getAnalysisSuccess ? <FileInfo dataFile={analysis.input_file} /> : <Loader />}
        </Modal>
        <Modal
          title="Error"
          visible={errorModal}
          footer={null}
          closable={true}
          onCancel={() => this.toggleModal('errorModal')}
          width={'80%'}
          destroyOnClose
        >
          {getAnalysisSuccess ? renderErrors(analysis.error) : <Loader />}
        </Modal>
      </Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
})

const actions = {
  getAnalysis,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.LG,
  isNotXLScreen: width <= 1600,
})

export default compose(
  withSizes(sizes),
  connect(
    selectors,
    actions,
  ),
)(TaskList)
