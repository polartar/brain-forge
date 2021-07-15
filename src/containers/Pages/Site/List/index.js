import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import { Button, Card, Empty, Modal, Table, Tag, Tooltip } from 'antd'
import { compact } from 'lodash'
import { BREAKPOINTS, TAG_COLORS } from 'config/base'
import {
  listSite,
  createSite,
  deleteSite,
  selectSites,
  selectSitesStatus,
  LIST_SITE,
  CREATE_SITE,
} from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { CheckIcon, Drawer, SiteAddForm } from 'components'
import { successAction } from 'utils/state-helpers'

export class SiteListPage extends Component {
  static propTypes = {
    sites: PropTypes.array,
    status: PropTypes.string,
    isDesktop: PropTypes.bool,
    isMobile: PropTypes.bool,
    listSite: PropTypes.func,
    createSite: PropTypes.func,
    deleteSite: PropTypes.func, // eslint-disable-line
  }

  state = {
    showAddDrawer: false,
  }

  componentWillMount() {
    this.props.listSite()
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(CREATE_SITE)) {
      this.setState({ showAddDrawer: false })
    }
  }

  get columns() {
    const { isDesktop } = this.props

    const columns = [
      isDesktop && {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'full_name',
        key: 'full_name',
        render: (text, record) => <Link to={`/site/${record.id}`}>{text}</Link>,
      },
      {
        title: 'Members',
        dataIndex: 'members',
        key: 'members',
        width: 300,
        render: (_, record) => (
          <div>
            {record.members.map(({ id, username }, ind) => (
              <Tag key={id} color={TAG_COLORS[ind]} className="my-02">
                {username}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        title: 'Invites',
        dataIndex: 'invites',
        key: 'invites',
        render: (_, record) => record.invites.length || 'No invites',
      },
      {
        title: 'Managed',
        dataIndex: 'managed',
        key: 'managed',
        render: (_, record) => <CheckIcon checked={record.is_managed} />,
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => {
          if (record.is_managed) {
            return null
          }

          return (
            <Tooltip title="Delete">
              <Button
                className="delete-btn"
                shape="circle"
                type="danger"
                icon="delete"
                size="small"
                onClick={() => this.handleDeleteSite(record)}
              />
            </Tooltip>
          )
        },
      },
    ]

    return compact(columns)
  }

  get loading() {
    const { status } = this.props
    return status === LIST_SITE
  }

  toggleShowDrawer = () => {
    const { showAddDrawer } = this.state

    if (showAddDrawer && this.loading) {
      return
    }

    this.setState({ showAddDrawer: !showAddDrawer })
  }

  handleSubmit = values => {
    this.props.createSite(values)
  }

  handleDeleteSite = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure you want to delete the site "${record.full_name}?"`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteSite(record.id)
      },
    })
  }

  render() {
    const { sites, isMobile } = this.props
    const { showAddDrawer } = this.state

    return (
      <PageLayout heading="Sites">
        <Card>
          <div className="text-right mb-1">
            <Button icon="appstore" type="primary" onClick={this.toggleShowDrawer}>
              Add Site
            </Button>
          </div>
          {sites.length > 0 ? (
            <Table
              dataSource={sites}
              columns={this.columns}
              size="small"
              bordered
              rowKey="id"
              pagination={false}
              scroll={{ x: isMobile }}
            />
          ) : (
            <Empty description="No Sites" />
          )}

          <Drawer title="Create Site" visible={showAddDrawer} onClose={this.toggleShowDrawer}>
            <SiteAddForm onSubmit={this.handleSubmit} onCancel={this.toggleShowDrawer} submitting={this.loading} />
          </Drawer>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  sites: selectSites,
  status: selectSitesStatus,
})

const actions = {
  listSite,
  createSite,
  deleteSite,
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
)(SiteListPage)
