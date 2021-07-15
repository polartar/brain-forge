import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Empty, Modal, Table } from 'antd'
import { find, differenceBy } from 'lodash'
import { UPDATE_STUDY } from 'store/modules/sites'
import { Drawer, UserSelectForm } from 'components'
import { successAction } from 'utils/state-helpers'

class SharedUsers extends Component {
  static propTypes = {
    study: PropTypes.object,
    users: PropTypes.array,
    editable: PropTypes.bool,
    status: PropTypes.string,
    updateStudy: PropTypes.func,
  }

  state = {
    showAddDrawer: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(UPDATE_STUDY)) {
      this.setState({ showAddDrawer: false })
    }
  }

  get data() {
    const { study } = this.props

    return study.shared_users
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
    const { showAddDrawer } = this.state

    this.setState({ showAddDrawer: !showAddDrawer })
  }

  handleAdd = data => {
    const { user } = data
    const { study } = this.props

    if (find(study.shared_users, { id: user })) {
      return
    }

    this.props.updateStudy({
      id: study.id,
      data: {
        shared_users: [...study.shared_users.map(dp => dp.id), user],
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

  handleDeleteUser = user => {
    const { id } = user
    const { study } = this.props

    this.props.updateStudy({
      id: study.id,
      data: {
        shared_users: study.shared_users.filter(dp => dp.id !== id).map(dp => dp.id),
      },
    })
  }

  get submitting() {
    const { status } = this.props

    return status === UPDATE_STUDY
  }

  render() {
    const { showAddDrawer } = this.state
    const { users, study, editable } = this.props

    const filteredUser = differenceBy(users, study.shared_users, user => user.id)

    return (
      <div>
        <div className="app-page__subheading">Shared Users</div>
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
        <Drawer title="Add User" visible={showAddDrawer} onClose={this.toggleDrawer}>
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
