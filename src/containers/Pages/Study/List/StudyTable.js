import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withSizes } from 'react-sizes'
import { Button, Empty, Modal, Table, Tooltip } from 'antd'
import { compact, get } from 'lodash'
import { BREAKPOINTS } from 'config/base'
import { Drawer, StudyForm, TagEditor } from 'components'
import { CREATE_STUDY, DELETE_STUDY, ASSIGN_TAGS } from 'store/modules/sites'
import { successAction } from 'utils/state-helpers'

export class StudyTable extends Component {
  static propTypes = {
    user: PropTypes.object,
    studies: PropTypes.array,
    sites: PropTypes.array,
    shared: PropTypes.bool,
    title: PropTypes.string,
    status: PropTypes.string,
    tags: PropTypes.array,
    isSuperUser: PropTypes.bool,
    isDesktop: PropTypes.bool,
    isMobile: PropTypes.bool,
    dataFilesStatus: PropTypes.string,
    createStudy: PropTypes.func,
    deleteStudy: PropTypes.func,
    // setUpdateStudy: PropTypes.func,
    assignTags: PropTypes.func,
  }

  state = {
    showAddDrawer: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(CREATE_STUDY)) {
      this.setState({
        showAddDrawer: false,
      })
    }
  }

  get columns() {
    const { user, shared, tags, isSuperUser, isDesktop } = this.props

    let columns = [
      isDesktop && {
        title: 'Short Name',
        dataIndex: 'label',
        key: 'label',
      },
      {
        title: 'Full Name',
        dataIndex: 'full_name',
        key: 'full_name',
        width: isDesktop && 400,
        render: (_, record) => <Link to={`/study/${record.id}`}>{record.full_name}</Link>,
      },
      {
        title: 'Affiliate',
        dataIndex: 'site',
        key: 'site',
        render: (_, record) => {
          /* istanbul ignore next */
          if (user.is_superuser) {
            return <Link to={`/site/${get(record, 'site.id', '')}`}>{get(record, 'site.full_name', '')}</Link>
          }

          /* istanbul ignore next */
          if (!shared) {
            return <Link to="/my-site">{get(record, 'site.full_name', '')}</Link>
          }

          /* istanbul ignore next */
          return get(record, 'site.full_name', '')
        },
      },
      {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags',
        render: (_, record) => (
          <TagEditor
            tags={tags}
            selectedTags={record.tags}
            editable={isSuperUser}
            onChange={selectedTags => this.handleAssignTags(record.id, selectedTags)}
          />
        ),
      },
      {
        title: 'PI',
        dataIndex: 'pi',
        key: 'pi',
        render: (_, record) => get(record, 'principal_investigator.username', ''),
      },
      {
        title: 'Analysis Plan',
        dataIndex: 'plan',
        key: 'plan',
        render: (_, record) => (
          <Link to={`/analysis-plans?study=${record.id}`}>
            <Button type="link" style={{ padding: 0 }}>
              {record.has_plan ? 'Yes' : 'No'}
            </Button>
          </Link>
        ),
      },
      isDesktop && {
        title: 'Analyses',
        dataIndex: 'analyses',
        key: 'analyses',
        render: (_, record) => (
          <Fragment>
            <Link to={`/preprocessing-summary/${record.label}`}>
              <Button size="small" style={{ display: 'block', marginBottom: 5 }}>
                Preprocessing
              </Button>
            </Link>
          </Fragment>
        ),
      },
    ]

    if (!shared) {
      columns.push({
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (_, record) => {
          /* istanbul ignore next */
          if (
            user.is_superuser ||
            get(record, 'created_by.id') === user.id ||
            (record.site.id === user.site && user.site_role === 'SiteAdmin')
          ) {
            return (
              <div className="d-flex">
                {/* <Tooltip title="Edit">
                  <Button
                    className="edit-btn mr-05"
                    icon="edit"
                    shape="circle"
                    size="small"
                    onClick={() => this.props.setUpdateStudy(record)}
                  />
                </Tooltip> */}
                {!record.is_managed && (
                  <Tooltip title="Delete">
                    <Button
                      className="delete-btn"
                      icon="delete"
                      shape="circle"
                      size="small"
                      type="danger"
                      onClick={() => this.handleDelete(record)}
                    />
                  </Tooltip>
                )}
              </div>
            )
          }
        },
      })
    }

    return compact(columns)
  }

  get loading() {
    const { status } = this.props

    return [CREATE_STUDY, DELETE_STUDY, ASSIGN_TAGS].indexOf(status) !== -1
  }

  toggleAddDrawer = () => {
    const { showAddDrawer } = this.state
    this.setState({ showAddDrawer: !showAddDrawer })
  }

  handleDelete = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure want to delete the study "${record.full_name}?"`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteStudy(record.id)
      },
    })
  }

  handleSubmit = values => {
    const { data } = values
    this.props.createStudy(data)
  }

  handleAssignTags = (studyId, selected) => {
    this.props.assignTags({ study: studyId, tags: selected })
  }

  render() {
    const { sites, studies, shared, title, user, isMobile } = this.props
    const { showAddDrawer } = this.state

    return (
      <div>
        {title && <h2 className="app-page__subheading">{title}</h2>}
        {!shared && (
          <div className="text-right mb-1">
            <Button icon="plus" type="primary" disabled={this.loading} onClick={this.toggleAddDrawer}>
              Add New Study
            </Button>
          </div>
        )}
        {studies.length > 0 ? (
          <Table
            dataSource={studies}
            columns={this.columns}
            pagination={false}
            size="small"
            bordered
            loading={this.loading}
            rowKey="id"
            scroll={{ x: isMobile }}
          />
        ) : (
          <Empty description="No Studies" />
        )}
        {!shared && (
          <Drawer title="Create Study" visible={showAddDrawer} onClose={this.toggleAddDrawer}>
            <StudyForm
              sites={sites}
              user={user}
              submitting={this.loading}
              onSubmit={this.handleSubmit}
              onCancel={this.toggleAddDrawer}
            />
          </Drawer>
        )}
      </div>
    )
  }
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.LG,
  isMobile: width < BREAKPOINTS.XXL,
})

export default withSizes(sizes)(StudyTable)
