import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import { Button, Card, Modal, Table, Tooltip } from 'antd'
import { compact } from 'lodash'
import { BREAKPOINTS } from 'config/base'
import { selectLoggedInUser } from 'store/modules/auth'
import {
  listSite,
  listScanner,
  createScanner,
  // updateScanner,
  deleteScanner,
  selectSites,
  selectScanners,
  selectSitesStatus,
  LIST_SITE,
  LIST_SCANNER,
  CREATE_SCANNER,
  // UPDATE_SCANNER,
} from 'store/modules/sites'
import { CheckIcon, Drawer, ScannerForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { PageLayout } from 'containers/Layouts'

export class ScannerListPage extends Component {
  state = {
    editingRecord: null,
    showDrawer: false,
  }

  static propTypes = {
    user: PropTypes.object,
    sites: PropTypes.array,
    scanners: PropTypes.shape({
      pageSize: PropTypes.number,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number,
      results: PropTypes.array,
    }),
    status: PropTypes.string,
    isDesktop: PropTypes.bool,
    isMobile: PropTypes.bool,
    listSite: PropTypes.func,
    listScanner: PropTypes.func,
    createScanner: PropTypes.func,
    // updateScanner: PropTypes.func,
    deleteScanner: PropTypes.func, // eslint-disable-line
  }

  componentWillMount() {
    const { user } = this.props

    if (user.is_superuser) {
      this.props.listSite()
    }

    this.handleFetchData({ page: 1 })
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      [successAction(CREATE_SCANNER) /*, successAction(UPDATE_SCANNER)*/].indexOf(nextProps.status) !== -1
    ) {
      this.setState({ showDrawer: false })
    }
  }

  get columns() {
    const { user, isDesktop } = this.props

    let columns = [
      isDesktop && { title: 'Id', dataIndex: 'id', key: 'id' },
      {
        title: 'Name',
        dataIndex: 'full_name',
        key: 'full_name',
        render: (text, record) => <Link to={`/scanner/${record.id}`}>{text}</Link>,
      },
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
      },
      isDesktop && {
        title: 'Model',
        dataIndex: 'model',
        key: 'model',
      },
      isDesktop && {
        title: 'Manufacturer',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
      },
      isDesktop && {
        title: 'Station',
        dataIndex: 'station',
        key: 'station',
      },
      isDesktop && {
        title: 'Field Strength',
        dataIndex: 'field_strength',
        key: 'field_strength',
      },
      {
        title: 'Site',
        dataIndex: 'site',
        key: 'site',
        superUser: true,
        render: (_, record) => record.site.label,
      },
      {
        title: 'Managed',
        dataIndex: 'managed',
        key: 'managed',
        render: (_, record) => <CheckIcon checked={record.is_managed} />,
      },
      {
        title: 'Shared',
        dataIndex: 'shared',
        key: 'shared',
        render: (_, record) => <CheckIcon checked={record.created_by.id !== user.id} />,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: 150,
        render: (_, record) => {
          if (record.is_managed || user.id !== record.created_by.id) {
            return null
          }

          return (
            <div className="d-flex">
              {/* <Tooltip title="Edit">
                <Button
                  className="edit-btn mr-05"
                  shape="circle"
                  icon="edit"
                  size="small"
                  onClick={() => this.handleEdit(record)}
                />
              </Tooltip> */}
              <Tooltip title="Delete">
                <Button
                  className="delete-btn"
                  shape="circle"
                  icon="delete"
                  type="danger"
                  size="small"
                  onClick={() => this.handleDelete(record)}
                />
              </Tooltip>
            </div>
          )
        },
      },
    ]

    columns = compact(columns)

    if (!user.is_superuser) {
      return columns.filter(column => !column.superUser)
    }

    return columns
  }

  get loading() {
    const { user, status } = this.props

    if (user.is_superuser) {
      return status === LIST_SITE || status === LIST_SCANNER
    }

    return status === LIST_SCANNER
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state

    this.setState({ showDrawer: !showDrawer })
  }

  handleFetchData = params => {
    this.props.listScanner({ params })
  }

  handleTableChange = pagination => {
    this.handleFetchData({ page: pagination.current, pageSize: pagination.pageSize })
  }

  // handleEdit = record => {
  //   this.setState({
  //     editingRecord: record,
  //     showDrawer: true,
  //   })
  // }

  handleDelete = record => {
    const comp = this

    if (record.datafiles_count > 0) {
      Modal.warning({
        title: (
          <div>
            This scanner cannot be deleted because it has data associated with it.
            <br />
            Please delete all data associated with the scanner first.
          </div>
        ),
      })
    } else {
      Modal.confirm({
        title: `Are you sure want to delete the scanner named "${record.full_name}"?`,
        okText: 'Yes',
        cancelText: 'No',
        onOk() {
          /* istanbul ignore next */
          comp.props.deleteScanner(record.id)
        },
      })
    }
  }

  handleScannerSubmit = payload => {
    const { user } = this.props
    const { data } = payload

    // if (id) {
    //   const scanner = user.is_superuser
    //     ? payload
    //     : {
    //         id,
    //         data: { ...data, site: user.site },
    //       }
    //   this.props.updateScanner(scanner)
    // } else {
    const scanner = user.is_superuser
      ? data
      : {
          ...data,
          site: user.site,
        }
    this.props.createScanner(scanner)
    // }
  }

  render() {
    const { user, sites, scanners, status, isMobile } = this.props
    const { editingRecord, showDrawer } = this.state

    return (
      <PageLayout heading="Scanners">
        <Card>
          <div className="text-right mb-1">
            <div className="d-inline-block">
              <Button
                className="add-btn"
                icon="plus"
                type="primary"
                disabled={this.loading}
                onClick={this.toggleDrawer}
              >
                Add New Scanner
              </Button>
            </div>
          </div>
          <Table
            dataSource={scanners.results}
            columns={this.columns}
            bordered
            size="small"
            rowKey="id"
            loading={this.loading}
            pagination={{
              size: 'large',
              current: scanners.currentPage,
              total: scanners.totalCount,
              pageSize: scanners.pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: isMobile }}
            onChange={this.handleTableChange}
          />
          <Drawer
            // title={editingRecord ? 'Edit Scanner' : 'Create Scanner'}
            title="Create Scanner"
            visible={showDrawer}
            onClose={this.toggleDrawer}
          >
            <ScannerForm
              scanner={editingRecord}
              sites={sites}
              submitting={status === CREATE_SCANNER}
              isSuper={user.is_superuser}
              onSubmit={this.handleScannerSubmit}
              onCancel={this.toggleDrawer}
            />
          </Drawer>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  sites: selectSites,
  user: selectLoggedInUser,
  scanners: selectScanners,
  status: selectSitesStatus,
})

const actions = {
  listSite,
  listScanner,
  createScanner,
  // updateScanner,
  deleteScanner,
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
)(ScannerListPage)
