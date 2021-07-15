import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button, Card, Empty, Modal } from 'antd'
import {
  getProfile,
  getMySite,
  createMySite,
  leaveMySite,
  deleteMySite,
  removeMemberMySite,
  sendInviteMySite,
  deleteInviteMySite,
  selectLoggedInUser,
  selectMySite,
  selectAuthStatus,
  GET_PROFILE,
  GET_MY_SITE,
  DELETE_MY_SITE,
  LEAVE_MY_SITE,
} from 'store/modules/auth'
import { PageLayout } from 'containers/Layouts'
import { Drawer, Loader, SiteAddForm, SiteInvites, SiteMembers, Tabs, TabPane } from 'components'
import { successAction } from 'utils/state-helpers'

export class MySitePage extends Component {
  static propTypes = {
    user: PropTypes.object,
    site: PropTypes.object,
    status: PropTypes.string,
    getProfile: PropTypes.func,
    getMySite: PropTypes.func,
    createMySite: PropTypes.func,
    leaveMySite: PropTypes.func, // eslint-disable-line
    deleteMySite: PropTypes.func, // eslint-disable-line
    removeMemberMySite: PropTypes.func,
    sendInviteMySite: PropTypes.func,
    deleteInviteMySite: PropTypes.func,
  }

  state = {
    showDrawer: false,
  }

  componentWillMount() {
    this.props.getMySite()
    this.props.getProfile()
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      (nextProps.status === successAction(DELETE_MY_SITE) || nextProps.status === successAction(LEAVE_MY_SITE))
    ) {
      this.setState({ showDrawer: false })
    }
  }

  get loading() {
    const { status } = this.props

    return [GET_PROFILE, GET_MY_SITE].indexOf(status) !== -1
  }

  get myRole() {
    const { user } = this.props

    if (user.is_superuser) {
      return 'SuperAdmin'
    }

    return user.site_role
  }

  toggleShowDrawer = () => {
    const { showDrawer } = this.state
    this.setState({ showDrawer: !showDrawer })
  }

  handleSubmit = data => {
    this.props.createMySite(data)
  }

  handleLeave = () => {
    const comp = this

    Modal.confirm({
      title: 'Are you sure want to leave your site?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.leaveMySite()
      },
    })
  }

  handleDelete = () => {
    const comp = this

    Modal.confirm({
      title: 'Are you sure want to delete your site?',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteMySite()
      },
    })
  }

  renderContent() {
    if (this.loading) {
      return <Loader />
    }

    const { user, site, status } = this.props
    const { showDrawer } = this.state

    if (!site) {
      return (
        <div>
          <Empty description={<span>No Site</span>}>
            <Button type="primary" onClick={this.toggleShowDrawer}>
              Create Site
            </Button>
          </Empty>
          <Drawer title="Create Site" visible={showDrawer} onClose={this.toggleShowDrawer}>
            <SiteAddForm onSubmit={this.handleSubmit} onCancel={this.toggleShowDrawer} submitting={this.loading} />
          </Drawer>
        </div>
      )
    }

    return (
      <PageLayout heading={site.full_name} subheading={`You are the ${this.myRole} of this site`}>
        <Card>
          <div className="text-right mb-2">
            {this.myRole === 'Admin' && (
              <Button className="delete-btn" type="danger" onClick={this.handleDelete}>
                Delete
              </Button>
            )}
            <Button className="leave-btn ml-1" type="danger" onClick={this.handleLeave}>
              Leave
            </Button>
          </div>
          <Tabs>
            <TabPane tab="Members" key="0">
              <SiteMembers
                user={user}
                site={site}
                myRole={this.myRole}
                status={status}
                removeMember={this.props.removeMemberMySite}
              />
            </TabPane>
            <TabPane tab="Invites" key="1">
              <SiteInvites
                site={site}
                myRole={this.myRole}
                status={status}
                sendInvite={this.props.sendInviteMySite}
                deleteInvite={this.props.deleteInviteMySite}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }

  render() {
    return <div className="app-page">{this.renderContent()}</div>
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  site: selectMySite,
  status: selectAuthStatus,
})

const actions = {
  getProfile,
  getMySite,
  createMySite,
  leaveMySite,
  deleteMySite,
  removeMemberMySite,
  sendInviteMySite,
  deleteInviteMySite,
}

export default connect(
  selectors,
  actions,
)(MySitePage)
