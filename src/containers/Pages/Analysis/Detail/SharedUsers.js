import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Empty, Table, Modal } from 'antd'
import { find, differenceBy } from 'lodash'
import { UPDATE_ANALYSIS } from 'store/modules/analyses'
import { Drawer, UserSelectForm } from 'components'
import { successAction } from 'utils/state-helpers'

class SharedUsers extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    users: PropTypes.array,
    editable: PropTypes.bool,
    status: PropTypes.string,
    updateAnalysis: PropTypes.func,
  }

  state = {
    showDrawer: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(UPDATE_ANALYSIS)) {
      this.setState({ showDrawer: false })
    }
  }

  get data() {
    const { analysis } = this.props

    return analysis.shared_users
  }

  get columns() {
    const { editable } = this.props

    let columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      },
    ]

    if (editable) {
      columns.push({
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => (
          <Button
            className="delete-btn"
            type="danger"
            size="small"
            shape="circle"
            icon="delete"
            onClick={() => this.handleDelete(record)}
          />
        ),
      })
    }

    return columns
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state
    this.setState({ showDrawer: !showDrawer })
  }

  handleAdd = data => {
    const { user } = data
    const { analysis } = this.props

    if (find(analysis.shared_users, { id: user })) {
      return
    }

    this.props.updateAnalysis({
      id: analysis.id,
      data: {
        shared_users: [...analysis.shared_users.map(dp => dp.id), user],
      },
    })
  }

  handleDelete = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure want to revoke permission from this user?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.handleDeleteUser(record)
      },
    })
  }

  handleDeleteUser = record => {
    const { analysis } = this.props
    const { id } = record

    this.props.updateAnalysis({
      id: analysis.id,
      data: {
        shared_users: analysis.shared_users.filter(user => user.id !== id).map(dp => dp.id),
      },
    })
  }

  get submitting() {
    const { status } = this.props
    return status === UPDATE_ANALYSIS
  }

  render() {
    const { showDrawer } = this.state
    const { users, analysis, editable } = this.props

    const filteredUser = differenceBy(users, analysis.shared_users, user => user.id)

    return (
      <div>
        <h2 className="text-center mb-2">Shared Users</h2>
        {editable && (
          <div className="text-right mb-1">
            <Button type="primary" icon="plus" onClick={this.toggleDrawer}>
              Add User
            </Button>
          </div>
        )}
        {this.data.length > 0 ? (
          <Table dataSource={this.data} columns={this.columns} size="small" rowKey="id" pagination={false} bordered />
        ) : (
          <Empty description="No Shared Users" />
        )}
        <Drawer title="Add User" visible={showDrawer} onClose={this.toggleDrawer}>
          <UserSelectForm
            submitting={this.submitting}
            users={filteredUser}
            onSubmit={this.handleAdd}
            onCancel={this.toggleDrawer}
          />
        </Drawer>
      </div>
    )
  }
}

export default SharedUsers
