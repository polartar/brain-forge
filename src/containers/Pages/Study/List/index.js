import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import { getProfile, selectLoggedInUser, selectIsSuperUser, selectAuthStatus, GET_PROFILE } from 'store/modules/auth'
import {
  listStudy,
  createStudy,
  // updateStudy,
  deleteStudy,
  listSite,
  listTag,
  assignTags,
  selectStudies,
  selectSites,
  selectTags,
  selectSitesStatus,
  LIST_SITE,
  LIST_STUDY,
  // UPDATE_STUDY,
} from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { Loader, Tabs, TabPane } from 'components'
import { getEditableSites } from 'utils/common'
// import { successAction } from 'utils/state-helpers'
import StudyTable from './StudyTable'

export class StudyListPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    sites: PropTypes.array,
    studies: PropTypes.array,
    tags: PropTypes.array,
    isSuperUser: PropTypes.bool,
    status: PropTypes.string,
    authStatus: PropTypes.string,
    getProfile: PropTypes.func,
    listSite: PropTypes.func,
    listStudy: PropTypes.func,
    createStudy: PropTypes.func,
    // updateStudy: PropTypes.func,
    deleteStudy: PropTypes.func,
    listTag: PropTypes.func,
    assignTags: PropTypes.func,
  }

  state = {
    activeTab: 'mine',
    // showDrawer: false,
    // updatingStudy: null,
  }

  componentWillMount() {
    const params = { shared: 'off' }
    this.props.listStudy({ params })
    this.props.listSite()
    this.props.getProfile()
    this.props.listTag()
  }

  // componentWillReceiveProps(nextProps) {
  //   const { status } = this.props
  //   if (status !== nextProps.status && nextProps.status === successAction(UPDATE_STUDY)) {
  //     this.setState({ showDrawer: false })
  //   }
  // }

  get preparingData() {
    const { status, authStatus } = this.props

    return [LIST_SITE, LIST_STUDY].indexOf(status) !== -1 || authStatus === GET_PROFILE
  }

  // get loading() {
  //   const { status } = this.props

  //   return status === UPDATE_STUDY
  // }

  handleSwitchTab = activeTab => {
    let shared

    if (activeTab === 'mine') {
      shared = 'off'
    } else if (activeTab === 'sharedWithMe') {
      shared = 'on'
    } else {
      shared = 'data'
    }

    const params = { shared }

    this.setState({ activeTab })
    this.props.listStudy({ params })
  }

  // toggleDrawer = () => {
  //   if (this.loading) {
  //     return
  //   }

  //   const { showDrawer } = this.state
  //   this.setState({ showDrawer: !showDrawer })
  // }

  // handleSetUpdateStudy = study => {
  //   this.setState({ showDrawer: true, updatingStudy: study })
  // }

  // handleSubmit = values => {
  //   this.props.updateStudy(values)
  // }

  // renderDrawer = () => {
  //   const { user, sites } = this.props
  //   const { showDrawer, updatingStudy } = this.state

  //   const editableSites = getEditableSites(sites, user)

  //   return (
  //     <Drawer title="Update Study" visible={showDrawer} onClose={this.toggleDrawer}>
  //       <StudyForm
  //         sites={editableSites}
  //         user={user}
  //         study={updatingStudy}
  //         submitting={this.loading}
  //         onSubmit={this.handleSubmit}
  //         onCancel={this.toggleDrawer}
  //       />
  //     </Drawer>
  //   )
  // }

  renderContent() {
    const { user, sites, studies, tags, isSuperUser, status, createStudy, deleteStudy, assignTags } = this.props
    const { activeTab } = this.state

    const tableProps = {
      sites: getEditableSites(sites, user),
      user,
      studies,
      tags,
      isSuperUser,
      status,
      createStudy,
      deleteStudy,
      // setUpdateStudy: this.handleSetUpdateStudy,
      assignTags,
    }

    if (this.preparingData) {
      return <Loader />
    }

    if (user.is_superuser) {
      return (
        <Card>
          <StudyTable {...tableProps} shared={false} />
          {/* {this.renderDrawer()} */}
        </Card>
      )
    }

    return (
      <Card>
        <Tabs activeKey={activeTab} onChange={this.handleSwitchTab}>
          <TabPane tab="My Studies" key="mine">
            <StudyTable {...tableProps} title="My Studies" shared={false} />
          </TabPane>
          <TabPane tab="Studies Shared With Me" key="sharedWithMe">
            <StudyTable {...tableProps} title="Studies Shared With Me" shared={true} />
          </TabPane>
          <TabPane tab="Studies Accepting My Data" key="datableStudies">
            <StudyTable {...tableProps} title="Studies Accepting My Data" shared={true} />
          </TabPane>
        </Tabs>
        {/* {this.renderDrawer()} */}
      </Card>
    )
  }

  render() {
    return <PageLayout heading="Studies">{this.renderContent()}</PageLayout>
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  sites: selectSites,
  studies: selectStudies,
  tags: selectTags,
  isSuperUser: selectIsSuperUser,
  status: selectSitesStatus,
  authStatus: selectAuthStatus,
})

const actions = {
  getProfile,
  listSite,
  listStudy,
  createStudy,
  // updateStudy,
  deleteStudy,
  listTag,
  assignTags,
}

export default connect(
  selectors,
  actions,
)(StudyListPage)
