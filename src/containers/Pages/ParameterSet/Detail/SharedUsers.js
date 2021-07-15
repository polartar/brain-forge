import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Empty, Modal, Table } from 'antd'
import { find, differenceBy } from 'lodash'
import { UPDATE_PARAMETER_SET } from 'store/modules/datafiles'
import { Drawer, UserSelectForm } from 'components'
import { successAction } from 'utils/state-helpers'

class SharedUsers extends Component {
  static propTypes = {
    parameterSet: PropTypes.object,
    users: PropTypes.array,
    editable: PropTypes.bool,
    status: PropTypes.string,
    updateParameterSet: PropTypes.func,
  }

  state = {
    showDrawer: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(UPDATE_PARAMETER_SET)) {
      this.setState({ showDrawer: false })
    }
  }

  get data() {
    const { parameterSet } = this.props
    return parameterSet.shared_users
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
    const { parameterSet } = this.props

    if (find(parameterSet.shared_users, { id: user })) {
      return
    }

    this.props.updateParameterSet({
      id: parameterSet.id,
      data: {
        shared_users: [...parameterSet.shared_users.map(dp => dp.id), user],
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
    const { parameterSet } = this.props
    const { id } = record

    this.props.updateParameterSet({
      id: parameterSet.id,
      data: {
        shared_users: parameterSet.shared_users.filter(dp => dp.id !== id).map(dp => dp.id),
      },
    })
  }

  get submitting() {
    const { status } = this.props

    return status === UPDATE_PARAMETER_SET
  }

  render() {
    const { showDrawer } = this.state
    const { users, parameterSet, editable } = this.props

    const filteredUser = differenceBy(users, parameterSet.shared_users, user => user.id)

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
