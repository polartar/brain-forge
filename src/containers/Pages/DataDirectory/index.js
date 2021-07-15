import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import { Alert, Card, Col, Button, Modal, Table, Tag, Tooltip, Row, Select } from 'antd'
import { WarningTwoTone } from '@ant-design/icons'
import { compact, concat, find, get, isEmpty, keys, map, mapValues, join, pick, uniqBy } from 'lodash'
import { BREAKPOINTS, TAG_COLORS } from 'config/base'
import { selectIsSuperUser } from 'store/modules/auth'
import { listTag, assignTags, selectTags } from 'store/modules/sites'
import {
  listDataDirectory,
  runMultipleAnalyses,
  runSingleAnalysis,
  listParameterSet,
  setCurrentFiles,
  selectCurrentFiles,
  selectDataDirectory,
  selectDataFilesStatus,
  LIST_DATA_DIRECTORY,
  RUN_MULTIPLE_ANALYSES,
  RUN_SINGLE_ANALYSIS,
} from 'store/modules/datafiles'
import {
  getAnalysisType,
  deleteAnalysis,
  clearAnalysisType,
  clearAnalysisOptions,
  selectAnalysisType,
  selectAnalysisTypes,
  selectCurrentAnalysis,
  LIST_ANALYSIS_TYPE,
} from 'store/modules/analyses'
import { selectModalities, selectProtocols, listProtocol } from 'store/modules/mappings'
import { listStudy, selectStudies } from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { AnalysisPredictionSection } from 'containers'
import { ProtocolPlanTable, ParamView, ProvenanceView, TagEditor } from 'components'
import { prepareDownloadResult, renderErrors, getOrderingParam } from 'utils/analyses'
import ExpandedRow from './ExpandedRow'
import SearchForm from './SearchForm'
import Result from './Result'
import DetailView from './DetailView'

const DEFAULT_SORTER = {
  field: 'subject',
  columnKey: 'subject',
  order: 'ascend',
}

export class DataDirectoryPage extends Component {
  static propTypes = {
    analysisTypes: PropTypes.array,
    dataDirectory: PropTypes.shape({
      pageSize: PropTypes.number,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number,
      results: PropTypes.array,
    }),
    modalities: PropTypes.array,
    protocols: PropTypes.array,
    studies: PropTypes.array,
    location: PropTypes.object,
    status: PropTypes.string,
    analysisType: PropTypes.object,
    currentAnalysis: PropTypes.object,
    currentFiles: PropTypes.array,
    tags: PropTypes.array,
    isSuperUser: PropTypes.bool,
    isDesktop: PropTypes.bool,
    isMobile: PropTypes.bool,
    listDataDirectory: PropTypes.func,
    listParameterSet: PropTypes.func,
    listProtocol: PropTypes.func,
    listStudy: PropTypes.func,
    runMultipleAnalyses: PropTypes.func,
    runSingleAnalysis: PropTypes.func,
    deleteAnalysis: PropTypes.func,
    getAnalysisType: PropTypes.func,
    setCurrentFiles: PropTypes.func,
    clearAnalysisType: PropTypes.func,
    clearAnalysisOptions: PropTypes.func,
    listTag: PropTypes.func,
    assignTags: PropTypes.func,
  }

  state = {
    detailModal: false,
    paramsModal: false,
    provenanceModal: false,
    selected: null,
    downloadingAnalysis: null,
    current: 1,
    pageSize: 10,
    filters: {},
    sorter: DEFAULT_SORTER,
    batchSelectionEnabled: false,
    selectedRowKeys: [],
    selectedAnalysisType: undefined,
    gettingAllAnalyses: false,
  }

  componentWillMount() {
    this.handleFetchData()
    this.props.listParameterSet()
    this.props.listTag()
    this.props.listProtocol()
    this.props.listStudy()
  }

  componentWillUnmount() {
    this.clearData()
    this.props.setCurrentFiles([])
  }

  componentDidUpdate() {
    const { dataDirectory } = this.props

    document.querySelectorAll('.ant-table-row-expand-icon').forEach(icon => {
      const analysisId = icon.closest('tr').getAttribute('data-row-key')
      const result = find(dataDirectory.results, { id: Number(analysisId) })

      icon.style.display = result.analyses.length > 0 ? 'block' : 'none'
    })
  }

  clearData = () => {
    this.props.clearAnalysisType()
    this.props.clearAnalysisOptions()
  }

  handleTableChange = (pagination, _, sorter) => {
    const { current, pageSize } = pagination

    this.setState(
      {
        current,
        pageSize,
        sorter: { ...pick(sorter, ['field', 'order', 'columnKey']) },
      },
      this.handleFetchData,
    )
  }

  handleShowSizeChange = (_, pageSize) => {
    this.setState({ pageSize, current: 1 }, this.handleFetchData)
  }

  handleFetchData = () => {
    const { current, pageSize, filters, sorter } = this.state

    // Rename subject to subject_session for sorter.
    const mappedSorter = mapValues(sorter, value => (value === 'subject' ? 'subject_session' : value))

    const params = Object.assign(
      {
        pageSize,
        page: current,
        ordering: getOrderingParam(mappedSorter),
        ...filters,
      },
      filters.study && filters.study.length > 0 && { study: filters.study.join(',') },
      filters.tags && filters.tags.length > 0 && { tags: filters.tags.join(',') },
    )

    this.props.listDataDirectory({ params })
  }

  handleRunAnalysis = id => {
    this.props.runMultipleAnalyses(id)
  }

  handleSearchFormChange = payload => {
    const { filters } = this.state

    this.setState({
      current: 1,
      filters: { ...filters, ...payload },
    })
  }

  handleSearchFormReset = () => {
    this.setState({ filters: {} }, this.handleFetchData)
  }

  handleSearchFormSubmit = () => {
    this.handleFetchData()
  }

  handleRunMultipleAnalysis = () => {
    const { selectedRowKeys } = this.state
    selectedRowKeys.forEach(id => this.props.runMultipleAnalyses(id))
  }

  handleRunSingleAnalysis = (id, planId) => {
    this.props.runSingleAnalysis({ id, planId })
  }

  handleAssignTags = (type, id, selected) => {
    this.props.assignTags({ [type]: id, tags: selected })
  }

  get analyses() {
    const { dataDirectory } = this.props
    const allAnalyses = dataDirectory.results.reduce((acc, elem) => {
      acc = concat(acc, elem.analyses)
      return acc
    }, [])

    return uniqBy(allAnalyses, 'id')
  }

  get paramViewProps() {
    const { analysisTypes } = this.props
    const { selected } = this.state

    const parameters = get(find(this.analyses, { id: selected }), 'parameters')
    const label = get(find(analysisTypes, { id: get(parameters, 'analysis.analysis_type') }), 'label')

    return { ...parameters, label, analyses: { resuts: this.analyses } }
  }

  get provenanceViewProps() {
    const { selected } = this.state

    const provenance = get(find(this.analyses, { id: selected }), 'provenance')

    return provenance
  }

  get columns() {
    const { tags, isSuperUser, isDesktop } = this.props
    const { sorter, filters } = this.state

    const columns = [
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        sorter: true,
        sortOrder: sorter.columnKey === 'subject' && sorter.order,
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <span className="mr-1">{record.subject_info.anon_id}</span>
            <TagEditor
              tags={tags}
              selectedTags={record.subject_info.tags}
              editable={isSuperUser}
              onChange={selectedTags => this.handleAssignTags('subject', record.subject_info.id, selectedTags)}
            />
            {record.has_missing_files && (
              <Tooltip title="Has missing files">
                <WarningTwoTone twoToneColor="#f5222d" />
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        title: 'Session',
        dataIndex: 'session',
        key: 'session',
        render: (_, record) => (
          <div className="d-flex align-items-center">
            <span className="mr-1">{record.session_info.segment_interval}</span>
            <TagEditor
              tags={tags}
              selectedTags={record.session_info.tags}
              editable={isSuperUser}
              onChange={selectedTags => this.handleAssignTags('session', record.session_info.id, selectedTags)}
            />
          </div>
        ),
      },
      {
        title: 'Protocol & Series',
        dataIndex: 'series',
        key: 'series',
        render: (_, record) => (
          <Tooltip title="View Scan Parameters">
            <span className="ant-btn-link p-0 word-break-all" onClick={() => this.toggleModal('detailModal', record)}>
              {`${record.series_info.label}_${String(record.series.sort_order).padStart(4, '0')} `}
            </span>
          </Tooltip>
        ),
      },
      {
        title: 'DataFile',
        dataIndex: 'name',
        key: 'name',
        render: text => <span className="word-break-all">{text}</span>,
      },
      {
        title: 'Modalities',
        dataIndex: 'modalities',
        key: 'modalities',
        render: (_, record) => (
          <Fragment>
            {record.modalities.map(modality => (
              <Tag
                key={modality.id}
                color={TAG_COLORS[modality.id % (TAG_COLORS.length - 1)]}
                style={{ marginBottom: 5 }}
              >
                {modality.full_name}
              </Tag>
            ))}
          </Fragment>
        ),
      },
      {
        title: 'Analysis',
        dataIndex: 'analysis',
        key: 'analysis',
        render: (_, record) => {
          const { protocol } = record.series

          if (!protocol) {
            return null
          }

          let plans = record.plans

          if (filters.analysis_type) {
            plans = plans.filter(plan => plan.analysis_type === Number(filters.analysis_type))
          }

          if (filters.parameter_set) {
            plans = plans.filter(plan => plan.parameter_set === Number(filters.parameter_set))
          }

          return (
            <ProtocolPlanTable
              {...record}
              plans={plans}
              study={record.study_info.id}
              protocolId={protocol.id}
              hideModality
              inCompactMode={!isDesktop}
              startAnalysis={planId => this.handleRunSingleAnalysis(record.id, planId)}
            />
          )
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (_, record) => join(record.analyses.map(analysis => analysis.status), ' / '),
      },
    ]

    return compact(columns)
  }

  get data() {
    const { dataDirectory, analysisTypes } = this.props
    const { downloadingAnalysis } = this.state
    const { results } = dataDirectory

    return map(results, study => ({
      ...study,
      key: study.id,
      downloadingAnalysis: downloadingAnalysis,
      analysisTypes: analysisTypes,
      onToggleModal: this.toggleModal,
      onShowResult: this.handleShowResult,
      onShowError: this.handleShowError,
      onDownloadResult: this.handleDownloadResult,
      onDeleteResult: this.handleDeleteResult,
    }))
  }

  get batchAnalysisButtonLabel() {
    const { status } = this.props
    const { selectedRowKeys } = this.state

    const isAnalysisStarting = status === RUN_MULTIPLE_ANALYSES
    const startStatus = isAnalysisStarting ? 'Starting' : 'Start'
    const analysisLabel = selectedRowKeys.length > 1 ? 'Analyses' : 'Analysis'

    return isEmpty(selectedRowKeys)
      ? 'Select Analyses to Start'
      : `${startStatus} ${selectedRowKeys.length} ${analysisLabel}`
  }

  get loading() {
    const { status } = this.props

    return [LIST_DATA_DIRECTORY, LIST_ANALYSIS_TYPE, RUN_MULTIPLE_ANALYSES, RUN_SINGLE_ANALYSIS].includes(status)
  }

  get isGroupAnalysisEnabled() {
    const { analysisType, currentAnalysis } = this.props
    return analysisType && keys(currentAnalysis).length > 0
  }

  toggleModal = (key, selected) => {
    this.setState(
      Object.assign(
        {
          [key]: !this.state[key],
        },
        selected && { selected },
      ),
    )
  }

  handleDownloadResult = async id => {
    this.setState({ downloadingAnalysis: id })

    await prepareDownloadResult(id)

    this.setState({ downloadingAnalysis: null })
  }

  handleShowError = error => {
    Modal.error({
      content: renderErrors(error),
      maskClosable: true,
      icon: null,
      okText: 'Dismiss',
      width: '80%',
    })
  }

  handleShowResult = record => {
    Modal.success({
      content: <Result id={record.id} dataFile={record.input_file} />,
      maskClosable: true,
      icon: null,
      okText: 'Dismiss',
      width: '80%',
    })
  }

  handleDeleteResult = id => {
    const comp = this

    Modal.confirm({
      title: `Are you sure want to delete this analysis result?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteAnalysis(id)
      },
    })
  }

  handleToggleBatchSelection = () => {
    const { batchSelectionEnabled } = this.state

    this.setState(
      Object.assign(
        { batchSelectionEnabled: !batchSelectionEnabled },
        batchSelectionEnabled && { selectedRowKeys: [] },
      ),
    )

    if (batchSelectionEnabled) {
      this.props.setCurrentFiles([])
    }
  }

  handleSelectAll = async () => {
    const { filters } = this.state

    this.setState({ gettingAllAnalyses: true })

    const params = {
      ...filters,
      group_analysis: this.isGroupAnalysisEnabled ? '1' : '0',
    }

    try {
      const { data } = await axios.get(`/data-directory-all/`, { params })
      this.setState({ selectedRowKeys: data.map(datafile => datafile.id) })
      this.props.setCurrentFiles(data)
    } catch (error) {}

    this.setState({ gettingAllAnalyses: false })
  }

  handleChangeSelectedRowKeys = selectedRowKeys => {
    const { currentFiles, dataDirectory } = this.props

    const datafiles = uniqBy([...dataDirectory.results, ...currentFiles], 'id').filter(datafile =>
      selectedRowKeys.includes(datafile.id),
    )

    this.props.setCurrentFiles(datafiles)

    this.setState({ selectedRowKeys })
  }

  handleSelectAnalysisType = analysisType => {
    if (analysisType) {
      this.setState({ selectedAnalysisType: analysisType })
      this.props.getAnalysisType(analysisType)
    } else {
      this.handleCloseGroupAnalysis()
    }
  }

  handleCloseGroupAnalysis = () => {
    this.clearData()
    this.props.setCurrentFiles([])
    this.setState({ batchSelectionEnabled: false, selectedRowKeys: [], selectedAnalysisType: undefined })
  }

  render() {
    const { analysisTypes, modalities, protocols, studies, tags, dataDirectory, status, isMobile } = this.props
    const {
      current,
      pageSize,
      filters,
      selected,
      batchSelectionEnabled,
      selectedRowKeys,
      selectedAnalysisType,
      detailModal,
      paramsModal,
      provenanceModal,
      gettingAllAnalyses,
    } = this.state

    const isAnalysisStarting = status === LIST_DATA_DIRECTORY

    const rowSelection = {
      selectedRowKeys,
      getCheckboxProps: record => ({
        disabled: record.plans.length === 0 && !this.isGroupAnalysisEnabled,
        name: record.name,
      }),
      onChange: this.handleChangeSelectedRowKeys,
    }

    return (
      <PageLayout heading="Data Directory">
        <Row gutter={12} type="flex" justify="space-between">
          <Col span={24}>
            <SearchForm
              analysisTypes={analysisTypes}
              modalities={modalities}
              protocols={protocols}
              studies={studies}
              tags={tags}
              values={filters}
              isMobile={isMobile}
              onChange={this.handleSearchFormChange}
              onReset={this.handleSearchFormReset}
              onSubmit={this.handleSearchFormSubmit}
            />
            <Alert
              className="mt-1"
              description={
                <div>
                  To add an analysis step to a series for all subjects in a study, click{' '}
                  <Link to="/analysis-plans">here</Link>
                </div>
              }
              type="info"
              showIcon
            />
          </Col>
        </Row>
        <Card className="mt-1">
          <Row>
            <Col md={10} lg={5}>
              <Select
                placeholder="Analysis Type"
                className="w-100"
                allowClear
                value={selectedAnalysisType}
                onChange={this.handleSelectAnalysisType}
              >
                {analysisTypes.map(analysisType => (
                  <Select.Option key={analysisType.id}>{analysisType.name}</Select.Option>
                ))}
              </Select>
              <Button
                className="mt-1"
                type="primary"
                disabled={!selectedAnalysisType}
                onClick={this.handleCloseGroupAnalysis}
              >
                Close Group Analysis
              </Button>
            </Col>
            <Col md={14} lg={19}>
              {this.isGroupAnalysisEnabled && (
                <div className="data-directory-analysis-configuration">
                  <AnalysisPredictionSection groupRun />
                </div>
              )}
            </Col>
          </Row>
        </Card>
        <Row className="mt-1" type="flex" justify="space-between">
          <Col className="d-flex align-items-center">
            <Button type="primary" disabled={gettingAllAnalyses} onClick={this.handleToggleBatchSelection}>
              {batchSelectionEnabled ? 'Disable' : 'Enable'} Batch Selection
            </Button>
            {batchSelectionEnabled && (
              <Tooltip title="This will select all analyses across the table">
                <Button style={{ marginLeft: 10 }} loading={gettingAllAnalyses} onClick={this.handleSelectAll}>
                  Select All
                </Button>
              </Tooltip>
            )}

            {batchSelectionEnabled && selectedAnalysisType && selectedRowKeys.length > 0 && (
              <div className="ml-1">
                <Tag color="magenta">{`Selected ${selectedRowKeys.length} files`}</Tag>
              </div>
            )}
          </Col>
          <Col>
            {batchSelectionEnabled && !this.isGroupAnalysisEnabled && (
              <Button
                disabled={isEmpty(selectedRowKeys) || gettingAllAnalyses}
                loading={isAnalysisStarting}
                onClick={this.handleRunMultipleAnalysis}
              >
                {this.batchAnalysisButtonLabel}
              </Button>
            )}
          </Col>
        </Row>
        <Card className="mt-1">
          <Table
            columns={this.columns}
            dataSource={this.data}
            className="data-directory-table"
            expandedRowRender={ExpandedRow}
            bordered
            loading={this.loading}
            pagination={{
              size: 'large',
              current,
              total: dataDirectory.totalCount,
              pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            rowKey="id"
            rowSelection={batchSelectionEnabled ? rowSelection : null}
            scroll={{ x: true }}
            onChange={this.handleTableChange}
          />
        </Card>
        {paramsModal && (
          <Modal
            title="Parameters"
            visible
            footer={null}
            width={800}
            destroyOnClose
            onOk={() => this.toggleModal('paramsModal')}
            onCancel={() => this.toggleModal('paramsModal')}
          >
            <ParamView {...this.paramViewProps} />
          </Modal>
        )}
        {provenanceModal && (
          <Modal
            title="Provenance"
            visible
            footer={null}
            width={800}
            destroyOnClose
            onOk={() => this.toggleModal('provenanceModal')}
            onCancel={() => this.toggleModal('provenanceModal')}
          >
            <ProvenanceView {...this.provenanceViewProps} />
          </Modal>
        )}
        {detailModal && (
          <Modal
            title="Details"
            visible
            footer={null}
            width="80%"
            destroyOnClose
            onOk={() => this.toggleModal('detailModal')}
            onCancel={() => this.toggleModal('detailModal')}
          >
            <DetailView datafile={selected} />
          </Modal>
        )}
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  analysisTypes: selectAnalysisTypes,
  dataDirectory: selectDataDirectory,
  modalities: selectModalities,
  protocols: selectProtocols,
  studies: selectStudies,
  status: selectDataFilesStatus,
  analysisType: selectAnalysisType,
  currentAnalysis: selectCurrentAnalysis,
  currentFiles: selectCurrentFiles,
  tags: selectTags,
  isSuperUser: selectIsSuperUser,
})

const actions = {
  listDataDirectory,
  listProtocol,
  listStudy,
  runMultipleAnalyses,
  runSingleAnalysis,
  listParameterSet,
  deleteAnalysis,
  getAnalysisType,
  setCurrentFiles,
  clearAnalysisType,
  clearAnalysisOptions,
  listTag,
  assignTags,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.LG,
  isMobile: width < BREAKPOINTS.SM,
})

export default compose(
  withSizes(sizes),
  connect(
    selectors,
    actions,
  ),
)(DataDirectoryPage)
