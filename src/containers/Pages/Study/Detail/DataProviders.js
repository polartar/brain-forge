import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Empty, Modal, Table } from 'antd'
import { find, differenceBy } from 'lodash'
import { UPDATE_STUDY } from 'store/modules/sites'
import { Drawer, UserSelectForm } from 'components'
import { successAction } from 'utils/state-helpers'

export default class DataProviders extends Component {
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

    return study.data_providers
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

    if (find(study.data_providers, { id: user })) {
      return
    }

    this.props.updateStudy({
      id: study.id,
      data: {
        data_providers: [...study.data_providers.map(dp => dp.id), user],
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
        comp.handleUpdateStudy(record)
      },
    })
  }

  handleUpdateStudy = record => {
    const { study } = this.props
    const { id } = record

    this.props.updateStudy({
      id: study.id,
      data: {
        data_providers: study.data_providers.filter(dp => dp.id !== id).map(dp => dp.id),
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

    const filteredUser = differenceBy(users, study.data_providers, user => user.id)

    return (
      <div>
        <div className="app-page__subheading">Data Providers</div>
        {editable && (
          <div className="text-right mb-1">
            <Button type="primary" icon="plus" onClick={this.toggleDrawer}>
              Add Data Provider
            </Button>
          </div>
        )}
        {this.data.length > 0 ? (
          <Table dataSource={this.data} columns={this.columns} size="small" rowKey="id" pagination={false} bordered />
        ) : (
          <Empty description="No Data Providers" />
        )}
        <Drawer title="Add Data Provider" visible={showAddDrawer} onClose={this.toggleDrawer}>
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
