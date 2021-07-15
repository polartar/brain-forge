import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import { listUser, selectLoggedInUser, selectUsers, LIST_USER } from 'store/modules/auth'
import {
  getAnalysis,
  updateAnalysis,
  deleteAnalysis,
  selectAnalysis,
  selectAnalysisTypes,
  selectAnalysesStatus,
  GET_ANALYSIS,
} from 'store/modules/analyses'
import { PageLayout } from 'containers/Layouts'
import { Loader, Tabs, TabPane } from 'components'
import { isSharedData } from 'utils/common'
import AnalysisInfo from './AnalysisInfo'
import SharedUsers from './SharedUsers'

export class AnalysisDetailPage extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisTypes: PropTypes.array,
    users: PropTypes.array,
    user: PropTypes.object,
    match: PropTypes.object,
    status: PropTypes.string,
    authStatus: PropTypes.string,
    getAnalysis: PropTypes.func,
    updateAnalysis: PropTypes.func,
    deleteAnalysis: PropTypes.func,
    listUser: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props

    this.props.getAnalysis(match.params.analysisId)
    this.props.listUser()
  }

  get preparingData() {
    const { status, authStatus } = this.props
    return status === GET_ANALYSIS || authStatus === LIST_USER
  }

  render() {
    if (this.preparingData) {
      return <Loader />
    }

    const { analysis, analysisTypes, users, user, status, updateAnalysis } = this.props

    if (!analysis) {
      return null
    }

    const editable = user.is_superuser || !isSharedData(analysis.shared_users, user)

    return (
      <PageLayout heading={analysis.name}>
        <Card>
          <Tabs>
            <TabPane tab="Analysis Info" key="0">
              <AnalysisInfo
                analysis={analysis}
                analysisTypes={analysisTypes}
                status={status}
                deleteAnalysis={this.props.deleteAnalysis}
              />
            </TabPane>
            <TabPane tab="Shared Users" key="1">
              <SharedUsers
                analysis={analysis}
                updateAnalysis={updateAnalysis}
                users={users}
                user={user}
                editable={editable}
                status={status}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  users: selectUsers,
  analysis: selectAnalysis,
  analysisTypes: selectAnalysisTypes,
  status: selectAnalysesStatus,
})

const actions = {
  getAnalysis,
  updateAnalysis,
  deleteAnalysis,
  listUser,
}

export default connect(
  selectors,
  actions,
)(AnalysisDetailPage)
