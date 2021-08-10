import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Tabs, Card } from 'antd'
import {
  listUser,
  getProfile,
  selectLoggedInUser,
  selectUsers,
  selectAuthStatus,
  GET_PROFILE,
  LIST_USER,
} from 'store/modules/auth'
import {
  getStudy,
  listSite,
  updateStudy,
  selectSites,
  selectStudy,
  selectSitesStatus,
  LIST_SITE,
  GET_STUDY,
} from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { PreprocessingSummaryTable } from 'containers'
import { Loader } from 'components'
import { getEditableSites, getFullname } from 'utils/common'
import StudyInfo from './StudyInfo'
import DataProviders from './DataProviders'
import SharedUsers from './SharedUsers'
import Download from './Download'

const { TabPane } = Tabs

export class StudyDetailPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.array,
    sites: PropTypes.array,
    study: PropTypes.object,
    match: PropTypes.object,
    status: PropTypes.string,
    authStatus: PropTypes.string,
    listUser: PropTypes.func,
    getProfile: PropTypes.func,
    listSite: PropTypes.func,
    getStudy: PropTypes.func,
    updateStudy: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props

    this.props.listSite()
    this.props.listUser()
    this.props.getStudy(match.params.studyId)
    this.props.getProfile()
  }

  get preparingData() {
    const { status, authStatus } = this.props

    return [LIST_SITE, GET_STUDY].indexOf(status) !== -1 || [GET_PROFILE, LIST_USER].indexOf(authStatus) !== -1
  }

  render() {
    if (this.preparingData) {
      return <Loader />
    }

    const { study, user, users, status, updateStudy } = this.props

    if (!study) {
      return null
    }

    const sites = getEditableSites(this.props.sites, user)

    const subProps = {
      study,
      sites,
      user,
      users,
      status,
      updateStudy,
      editable: user.is_superuser || study.created_by.id === user.id,
    }

    return (
      <PageLayout
        heading={study.full_name}
        subheading={`Principal Investigator: ${getFullname(study.principal_investigator)}`}
      >
        <Card>
          <Tabs animated={false}>
            <TabPane tab="Preprocessing Summary" key="preprocessing-summary">
              <PreprocessingSummaryTable study={study} showTitle />
            </TabPane>
            <TabPane tab="Study Info" key="study-info">
              <StudyInfo {...subProps} />
            </TabPane>
            <TabPane tab="Data Providers" key="data-providers">
              <DataProviders {...subProps} />
            </TabPane>
            <TabPane tab="Shared Users" key="shared-users">
              <SharedUsers {...subProps} />
            </TabPane>
            <TabPane tab="Download" key="download">
              <Download {...subProps} />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  users: selectUsers,
  user: selectLoggedInUser,
  sites: selectSites,
  study: selectStudy,
  status: selectSitesStatus,
  authStatus: selectAuthStatus,
})

const actions = {
  listUser,
  getProfile,
  listSite,
  getStudy,
  updateStudy,
}

export default connect(
  selectors,
  actions,
)(StudyDetailPage)