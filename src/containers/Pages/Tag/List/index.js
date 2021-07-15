import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button, Card, Modal, Table, Tag, Tooltip } from 'antd'
import pluralize from 'pluralize'
import {
  listTag,
  createTag,
  updateTag,
  deleteTag,
  selectTags,
  selectSitesStatus,
  CREATE_TAG,
  UPDATE_TAG,
} from 'store/modules/sites'
import { Drawer, TagForm } from 'components'
import { PageLayout } from 'containers/Layouts'
import { successAction } from 'utils/state-helpers'

export class TagListPage extends Component {
  static propTypes = {
    tags: PropTypes.array,
    status: PropTypes.string,
    listTag: PropTypes.func,
    createTag: PropTypes.func,
    updateTag: PropTypes.func,
    deleteTag: PropTypes.func,
  }

  state = {
    editingRecord: null,
    showDrawer: false,
  }

  componentDidMount() {
    this.props.listTag()
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      [successAction(CREATE_TAG), successAction(UPDATE_TAG)].indexOf(nextProps.status) !== -1
    ) {
      this.setState({ showDrawer: false, editingRecord: null })
    }
  }

  get columns() {
    const columns = [
      { title: 'Id', dataIndex: 'id', key: 'id' },
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
        render: (text, record) => (
          <Link to={`/tag/${record.id}`}>
            <Tag color={record.color} className="cursor-pointer">
              {text}
            </Tag>
          </Link>
        ),
      },
      { title: 'Studies', dataIndex: 'studies', key: 'studies', render: (_, record) => record.studies.length },
      { title: 'Subjects', dataIndex: 'subjects', key: 'subjects', render: (_, record) => record.subjects.length },
      { title: 'Sessions', dataIndex: 'sessions', key: 'sessions', render: (_, record) => record.sessions.length },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: 150,
        render: (_, record) => {
          return (
            <div className="d-flex">
              <Tooltip title="Edit">
                <Button
                  className="edit-btn mr-05"
                  shape="circle"
                  icon="edit"
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
                  onClick={() => this.handleDelete(record)}
                />
              </Tooltip>
            </div>
          )
        },
      },
    ]

    return columns
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state
    this.setState({ showDrawer: !showDrawer })
  }

  handleSubmit = payload => {
    const { id, data } = payload

    if (id) {
      this.props.updateTag(payload)
    } else {
      this.props.createTag(data)
    }
  }

  handleEdit = record => {
    this.setState({
      editingRecord: record,
      showDrawer: true,
    })
  }

  handleDelete = record => {
    const comp = this
    let tagInfo = []

    if (record.studies.length > 0) {
      tagInfo.push(pluralize('study', record.studies.length, true))
    }

    if (record.sessions.length > 0) {
      tagInfo.push(pluralize('session', record.studies.length, true))
    }

    if (record.subjects.length > 0) {
      tagInfo.push(pluralize('subject', record.studies.length, true))
    }

    const content = tagInfo.length > 0 ? `This tag is linked to ${tagInfo.join(', ')}.` : ''

    Modal.confirm({
      title: `Are you sure want to delete the tag labeled "${record.label}"?`,
      content,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteTag(record.id)
      },
    })
  }

  render() {
    const { tags, status } = this.props
    const { editingRecord, showDrawer } = this.state

    return (
      <PageLayout heading="Tags">
        <Card>
          <div className="text-right mb-1">
            <Button icon="plus" type="primary" disabled={this.loading} onClick={this.toggleDrawer}>
              Add Tag
            </Button>
          </div>
          <Table columns={this.columns} dataSource={tags} bordered size="small" rowKey="id" loading={this.loading} />
          <Drawer title={editingRecord ? 'Edit Tag' : 'Create Tag'} visible={showDrawer} onClose={this.toggleDrawer}>
            <TagForm
              tag={editingRecord}
              submitting={status === CREATE_TAG}
              onSubmit={this.handleSubmit}
              onCancel={this.toggleDrawer}
            />
          </Drawer>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  tags: selectTags,
  status: selectSitesStatus,
})

const actions = {
  listTag,
  createTag,
  updateTag,
  deleteTag,
}

export default connect(
  selectors,
  actions,
)(TagListPage)
