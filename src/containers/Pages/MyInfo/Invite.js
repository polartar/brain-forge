import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  listMyInvite,
  acceptMyInvite,
  rejectMyInvite,
  selectMyInvites,
  selectAuthStatus,
  LIST_MY_INVITE,
  ACCEPT_MY_INVITE,
  REJECT_MY_INVITE,
} from 'store/modules/auth'
import { createStructuredSelector } from 'reselect'
import { Button, Empty, Table, Modal } from 'antd'
import moment from 'moment'

export class MyInvite extends Component {
  static propTypes = {
    invites: PropTypes.array,
    status: PropTypes.string,
    listMyInvite: PropTypes.func,
    acceptMyInvite: PropTypes.func, // eslint-disable-line
    rejectMyInvite: PropTypes.func, // eslint-disable-line
  }

  componentWillMount() {
    this.props.listMyInvite()
  }

  get columns() {
    return [
      {
        title: 'Site',
        dataIndex: 'site',
        key: 'site',
        render: (_, record) => record.site.full_name,
      },
      {
        title: 'Sent Date',
        dataIndex: 'sent_date',
        key: 'sent_date',
        render: (_, record) => moment(record.sent_date).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <div className="d-flex">
            <Button
              className="accept-btn mr-05"
              icon="check"
              shape="circle"
              size="small"
              onClick={() => this.handleInviteAccept(record)}
            />
            <Button
              className="delete-btn"
              icon="delete"
              shape="circle"
              size="small"
              type="danger"
              onClick={() => this.handleInviteReject(record)}
            />
          </div>
        ),
      },
    ]
  }

  get loading() {
    const { status } = this.props

    return [LIST_MY_INVITE, ACCEPT_MY_INVITE, REJECT_MY_INVITE].indexOf(status) !== -1
  }

  handleInviteAccept = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure you want to join the site "${record.site.full_name}?" You'll be removed from your current site.`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.acceptMyInvite({ siteId: record.site.id, inviteId: record.id })
      },
    })
  }

  handleInviteReject = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure to reject this invite?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.rejectMyInvite({ siteId: record.site.id, inviteId: record.id })
      },
    })
  }

  render() {
    const { invites } = this.props

    return (
      <div>
        <div className="app-page__subheading">Invites</div>
        {invites.length > 0 ? (
          <Table
            dataSource={invites}
            columns={this.columns}
            loading={this.loading}
            rowKey="id"
            size="small"
            bordered
            pagination={false}
          />
        ) : (
          <Empty description="No Invites" />
        )}
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  invites: selectMyInvites,
  status: selectAuthStatus,
})

const actions = {
  listMyInvite,
  acceptMyInvite,
  rejectMyInvite,
}

export default connect(
  selectors,
  actions,
)(MyInvite)
