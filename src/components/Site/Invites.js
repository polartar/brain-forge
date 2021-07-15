import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Empty, Table, Modal } from 'antd'
import moment from 'moment'
import { SEND_INVITE_MY_SITE, DELETE_INVITE_MY_SITE } from 'store/modules/auth'
import { SEND_INVITE, DELETE_INVITE } from 'store/modules/sites'
import { Drawer, SiteInviteForm } from 'components'
import { successAction } from 'utils/state-helpers'

export default class SiteInvites extends Component {
  static propTypes = {
    site: PropTypes.object,
    myRole: PropTypes.string,
    status: PropTypes.string,
    sendInvite: PropTypes.func,
    deleteInvite: PropTypes.func, // eslint-disable-line
  }

  state = {
    showDrawer: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      [successAction(SEND_INVITE), successAction(SEND_INVITE_MY_SITE)].indexOf(nextProps.status) !== -1
    ) {
      this.setState({ showDrawer: false })
    }
  }

  get columns() {
    const { myRole } = this.props

    let columns = [
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
      {
        title: 'Sent Date',
        dataIndex: 'sent_date',
        key: 'sent_date',
        render: (_, record) => moment(record.sent_date).format('YYYY-MM-DD HH:mm:ss'),
      },
    ]

    if (myRole === 'Admin' || myRole === 'SuperAdmin') {
      columns.push({
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <div className="d-flex">
            <Button
              className="resend-btn mr-05"
              icon="mail"
              shape="circle"
              size="small"
              onClick={() => this.handleResend(record)}
            />
            <Button
              className="cancel-btn"
              type="danger"
              icon="delete"
              shape="circle"
              size="small"
              onClick={() => this.handleCancel(record)}
            />
          </div>
        ),
      })
    }

    return columns
  }

  toggleShowDrawer = () => {
    const { showDrawer } = this.state
    this.setState({ showDrawer: !showDrawer })
  }

  handleSubmit = data => {
    const { id } = this.props.site
    this.props.sendInvite({ siteId: id, data })
  }

  handleResend = invite => {
    this.handleSubmit({ email: invite.email })
  }

  handleCancel = invite => {
    const comp = this
    const { id } = this.props.site

    Modal.confirm({
      title: `Are you sure want to cancel this invite?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteInvite({ siteId: id, inviteId: invite.id })
      },
    })
  }

  get loading() {
    const { status } = this.props
    return [SEND_INVITE, DELETE_INVITE, SEND_INVITE_MY_SITE, DELETE_INVITE_MY_SITE].indexOf(status) !== -1
  }

  render() {
    const { showDrawer } = this.state
    const { myRole, site } = this.props

    return (
      <div>
        <h2 className="text-center mb-2">Invites</h2>
        {(myRole === 'Admin' || myRole === 'SuperAdmin') && (
          <div className="text-right mb-1">
            <Button icon="mail" type="primary" disabled={this.loading} onClick={this.toggleShowDrawer}>
              Invite
            </Button>
          </div>
        )}
        {site.invites.length > 0 ? (
          <Table
            dataSource={site.invites}
            columns={this.columns}
            size="small"
            bordered
            rowKey="id"
            pagination={false}
            loading={this.loading}
          />
        ) : (
          <Empty description="No Invites" />
        )}
        <Drawer title="Send Invite" visible={showDrawer} onClose={this.toggleShowDrawer}>
          <SiteInviteForm onSubmit={this.handleSubmit} onCancel={this.toggleShowDrawer} submitting={this.loading} />
        </Drawer>
      </div>
    )
  }
}
