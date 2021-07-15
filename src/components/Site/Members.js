import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Empty, Table, Modal } from 'antd'
import { CheckIcon } from 'components'

export default class SiteMembers extends Component {
  static propTypes = {
    user: PropTypes.object,
    site: PropTypes.object,
    myRole: PropTypes.string,
    removeMember: PropTypes.func, // eslint-disable-line
  }

  get columns() {
    const { myRole } = this.props

    let columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => `${record.first_name} ${record.last_name}`,
      },
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        render: (_, record) => record.username,
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (_, record) => {
          const isPI = record.created_studies.length > 0
          return `${isPI ? 'PI' : 'User'}${record.site_role === 'Admin' ? ' (Site Admin)' : ''}`
        },
      },
      {
        title: 'Managed',
        dataIndex: 'managed',
        key: 'managed',
        render: (_, record) => <CheckIcon checked={record.is_managed} />,
      },
    ]

    if (myRole === 'Admin' || myRole === 'SuperAdmin') {
      columns.push({
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <Button
            className="remove-btn"
            shape="circle"
            icon="delete"
            size="small"
            type="danger"
            onClick={() => this.handleRemoveMember(record)}
          />
        ),
      })
    }

    return columns
  }

  handleRemoveMember = record => {
    const comp = this
    const { site, user } = this.props

    Modal.confirm({
      title: (
        <div>
          Are you sure to remove <b>{record.username}</b> from this site?
          {record.site_role === 'Admin' && <div className="mt-1">{record.username} is the admin of this site.</div>}
        </div>
      ),
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.removeMember({ siteId: site.id, userId: user && user.id, membershipId: record.id })
      },
    })
  }

  render() {
    const { site } = this.props

    return (
      <div>
        <h2 className="text-center mb-2">Members</h2>
        {site.members.length > 0 ? (
          <Table
            dataSource={site.members}
            columns={this.columns}
            size="small"
            bordered
            rowKey="id"
            pagination={false}
          />
        ) : (
          <Empty description="No Members" />
        )}
      </div>
    )
  }
}
