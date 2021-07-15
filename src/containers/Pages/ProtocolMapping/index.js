import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import { Alert, Button, Card, Input, Modal, Table, Tag, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { compact, first } from 'lodash'
import { BREAKPOINTS, TAG_COLORS } from 'config/base'
import { LIST_STUDY, listStudy, selectStudies } from 'store/modules/sites'
import {
  LIST_PROTOCOL,
  LIST_MODALITY,
  LIST_PROTOCOL_MAPPING,
  CREATE_PROTOCOL_MAPPING,
  UPDATE_PROTOCOL_MAPPING,
  DELETE_PROTOCOL_MAPPING,
  listProtocol,
  listModality,
  listProtocolMapping,
  createProtocolMapping,
  updateProtocolMapping,
  deleteProtocolMapping,
  selectProtocolMappings,
  selectProtocols,
  selectModalities,
  selectModalitiesStatus,
} from 'store/modules/mappings'
import { PageLayout } from 'containers/Layouts'
import { Drawer } from 'components'
import { successAction } from 'utils/state-helpers'
import ProtocolMappingForm from './ProtocolMappingForm'

export class ProtocolMappingPage extends Component {
  static propTypes = {
    studies: PropTypes.array,
    protocols: PropTypes.array,
    modalities: PropTypes.array,
    protocolMappings: PropTypes.shape({
      pageSize: PropTypes.number,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number,
      results: PropTypes.array,
    }),
    status: PropTypes.string,
    isMobile: PropTypes.bool,
    listProtocol: PropTypes.func,
    listModality: PropTypes.func,
    listStudy: PropTypes.func,
    listProtocolMapping: PropTypes.func,
    createProtocolMapping: PropTypes.func,
    updateProtocolMapping: PropTypes.func,
    deleteProtocolMapping: PropTypes.func, // eslint-disable-line
  }

  state = {
    editingRecord: null,
    deletingRecord: null,
    showDrawer: false,
    pagination: null,
    filters: {},
  }

  componentDidMount() {
    this.props.listStudy()
    this.props.listProtocol()
    this.props.listModality()
    this.props.listProtocolMapping()
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      [
        successAction(CREATE_PROTOCOL_MAPPING),
        successAction(UPDATE_PROTOCOL_MAPPING),
        successAction(DELETE_PROTOCOL_MAPPING),
      ].includes(nextProps.status)
    ) {
      this.setState({
        editingRecord: null,
        deletingRecord: null,
        showDrawer: false,
      })
    }

    this.setPagination(nextProps)
  }

  setPagination = props => {
    const { currentPage, pageSize, totalCount } = props.protocolMappings
    const pagination = { current: currentPage, pageSize, total: totalCount }

    this.setState({ pagination })
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state
    this.setState(
      Object.assign(
        {
          showDrawer: !showDrawer,
        },
        showDrawer && { editingRecord: null },
      ),
    )
  }

  handleTableChange = (pagination, filters) => {
    this.setState({ pagination, filters }, this.handleFetchData)
  }

  handleFetchData = () => {
    const { pagination, filters } = this.state

    const { study, protocol, modalities } = filters

    const params = Object.assign(
      { page: pagination.current },
      study && { study: study[0] },
      protocol && { protocol: protocol[0] },
      modalities && { modalities: modalities.join(',') },
    )

    this.props.listProtocolMapping({ params })
  }

  handleEdit = record => {
    this.setState({ editingRecord: record, showDrawer: true })
  }

  handleDelete = id => {
    const comp = this

    Modal.confirm({
      title: `Are you sure want to cancel this invite?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteProtocolMapping(id)
        /* istanbul ignore next */
        comp.setState({ deletingRecord: id })
      },
    })
  }

  handleSubmit = payload => {
    const { id, data } = payload

    if (id) {
      this.props.updateProtocolMapping({ id, data })
    } else {
      this.props.createProtocolMapping(data)
    }
  }

  get data() {
    const { modalities, protocolMappings } = this.props

    if (modalities.length === 0) {
      return []
    }

    return protocolMappings.results
  }

  get columns() {
    const { modalities, isMobile } = this.props
    const { deletingRecord } = this.state

    const columns = [
      !isMobile && {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Study',
        dataIndex: 'study.full_name',
        key: 'study',
        ...this.getColumnSearchProps('Study'),
      },
      {
        title: 'Protocol',
        dataIndex: 'protocol.full_name',
        key: 'protocol',
        ...this.getColumnSearchProps('Protocol'),
      },
      {
        title: 'Modalities',
        dataIndex: 'modalities',
        key: 'modalities',
        filters: modalities.map(modality => ({ text: modality.full_name, value: modality.id })),
        width: 240,
        render: (_, record) => (
          <Fragment>
            {record.modalities.map(modality => (
              <Tag key={modality.id} color={TAG_COLORS[modality.id % (TAG_COLORS.length - 1)]}>
                {modality.full_name}
              </Tag>
            ))}
          </Fragment>
        ),
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: (_, record) => (
          <div className="d-flex">
            <Tooltip title="Edit">
              <Button
                className="edit-btn mr-05"
                icon="edit"
                shape="circle"
                size="small"
                onClick={() => this.handleEdit(record)}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button
                className="delete-btn"
                shape="circle"
                icon="delete"
                type="danger"
                size="small"
                loading={deletingRecord === record.id}
                onClick={() => this.handleDelete(record.id)}
              />
            </Tooltip>
          </div>
        ),
      },
    ]

    return compact(columns)
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
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          name="searchBtn"
          className="searchBtn"
          onClick={confirm}
          icon="searchoutlined"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button name="resetBtn" onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => {
      /* istanbul ignore next */
      return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    },
  })

  get loading() {
    const { status } = this.props

    return [LIST_STUDY, LIST_PROTOCOL, LIST_MODALITY, LIST_PROTOCOL_MAPPING].includes(status)
  }

  renderContent = () => {
    const { studies, protocols, modalities, isMobile } = this.props
    const { showDrawer, editingRecord, pagination } = this.state

    if (!this.loading && studies.length === 0) {
      return (
        <Alert
          type="warning"
          message="You should be site admin or have studies to map protocols and modalities"
          banner
        />
      )
    }

    return (
      <Fragment>
        <div className="text-right mb-1">
          <Button icon="appstore" type="primary" onClick={this.toggleDrawer}>
            Add Mappings
          </Button>
        </div>
        <Table
          dataSource={this.data}
          columns={this.columns}
          bordered
          rowKey="id"
          size="middle"
          pagination={{ size: 'large', ...pagination }}
          loading={this.loading}
          scroll={{ x: isMobile }}
          onChange={this.handleTableChange}
        />

        <Drawer title="Set protocol and modalities on study" visible={showDrawer} onClose={this.toggleDrawer}>
          <ProtocolMappingForm
            initialValues={editingRecord}
            studies={studies}
            protocols={protocols}
            modalities={modalities}
            onSubmit={this.handleSubmit}
            onDelete={this.handleDelete}
            onCancel={this.toggleDrawer}
          />
        </Drawer>
      </Fragment>
    )
  }

  render() {
    return (
      <PageLayout heading="Protocol Mapping">
        <Card>{this.renderContent()}</Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  studies: selectStudies,
  protocols: selectProtocols,
  protocolMappings: selectProtocolMappings,
  modalities: selectModalities,
  status: selectModalitiesStatus,
})

const actions = {
  listStudy,
  listProtocol,
  listModality,
  listProtocolMapping,
  createProtocolMapping,
  updateProtocolMapping,
  deleteProtocolMapping,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isMobile: width < BREAKPOINTS.SM,
})

export default compose(
  withSizes(sizes),
  connect(
    selectors,
    actions,
  ),
)(ProtocolMappingPage)
