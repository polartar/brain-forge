import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Switch } from 'antd'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { capitalize, get } from 'lodash'
import { selectLoggedInUser } from 'store/modules/auth'
import {
  listAnalysis,
  listAnalysisUser,
  deleteAnalysis,
  selectAnalyses,
  selectAnalysisTypes,
  selectAnalysesStatus,
  selectAnalysisUsers,
  LIST_ANALYSIS,
} from 'store/modules/analyses'
import { listStudy, selectStudies } from 'store/modules/sites'
import { ANALYSIS_STATES } from 'config/base'
import { TaskList } from 'components'
import { getAnalysisDefaultSorter } from 'utils/analyses'

const { TabPane } = Tabs

export class TaskSection extends Component {
  static propTypes = {
    analysisTypes: PropTypes.array,
    analysisUsers: PropTypes.array,
    user: PropTypes.object,
    analyses: PropTypes.object,
    studies: PropTypes.array,
    status: PropTypes.string,
    listAnalysis: PropTypes.func,
    deleteAnalysis: PropTypes.func,
    listAnalysisUser: PropTypes.func,
    listStudy: PropTypes.func,
  }

  state = {
    activeTab: 'mine',
    activeKey: ANALYSIS_STATES.success.name,
    selection: false,
  }

  componentDidMount() {
    this.props.listAnalysisUser()
    this.props.listStudy()

    this.handleTaskStatusChange(ANALYSIS_STATES.all.name)
  }

  handleFetchData = params => {
    if (get(params, 'status')) {
      params.status = get(ANALYSIS_STATES, [params.status, 'id'])
    }

    this.props.listAnalysis({ params })
  }

  handleTaskStatusChange = status => {
    const { analyses } = this.props

    this.setState({ activeKey: status }, () => {
      this.handleFetchData({
        page: 1,
        pageSize: analyses.pageSize,
        status,
        ordering: getAnalysisDefaultSorter(status),
        shared: this.isShared ? 'on' : 'off',
      })
    })
  }

  handleTaskOwnerTypeChange = ownerType => {
    this.setState({ activeTab: ownerType, activeKey: ANALYSIS_STATES.success.name }, () => {
      this.handleTaskStatusChange(ANALYSIS_STATES.success.name)
    })
  }

  handleSwitchSelection = checked => {
    this.setState({ selection: checked })
  }

  get preparingData() {
    const { status } = this.props
    return status === LIST_ANALYSIS
  }

  get subProps() {
    const { analysisTypes, analyses, user, analysisUsers, studies } = this.props
    const { selection } = this.state

    return {
      analysisTypes,
      analyses,
      user,
      analysisUsers,
      selection,
      studies,
      loading: this.preparingData,
      fetchData: this.handleFetchData,
      deleteAnalysis: this.props.deleteAnalysis,
    }
  }

  get isShared() {
    const { activeTab } = this.state
    return activeTab === 'shared'
  }

  renderTabs = () => {
    const { user } = this.props
    const { activeKey, selection } = this.state
    const subProps = this.subProps

    return (
      <Tabs
        size="large"
        activeKey={activeKey}
        animated={false}
        onChange={this.handleTaskStatusChange}
        tabBarExtraContent={
          (user.is_superuser || !this.isShared) && (
            <Switch
              checkedChildren="Select"
              unCheckedChildren="Select"
              checked={selection}
              onChange={this.handleSwitchSelection}
            />
          )
        }
      >
        <TabPane tab={capitalize(ANALYSIS_STATES.all.name)} key={ANALYSIS_STATES.all.name}>
          <TaskList {...subProps} type={ANALYSIS_STATES.all.name} shared={this.isShared} />
        </TabPane>
        <TabPane tab={capitalize(ANALYSIS_STATES.success.name)} key={ANALYSIS_STATES.success.name}>
          <TaskList {...subProps} type={ANALYSIS_STATES.success.name} shared={this.isShared} />
        </TabPane>
        <TabPane tab={capitalize(ANALYSIS_STATES.error.name)} key={ANALYSIS_STATES.error.name}>
          <TaskList {...subProps} type={ANALYSIS_STATES.error.name} shared={this.isShared} />
        </TabPane>
        <TabPane tab={capitalize(ANALYSIS_STATES.running.name)} key={ANALYSIS_STATES.running.name}>
          <TaskList {...subProps} type={ANALYSIS_STATES.running.name} shared={this.isShared} />
        </TabPane>
      </Tabs>
    )
  }

  render() {
    const { user } = this.props

    return user.is_superuser ? (
      this.renderTabs()
    ) : (
      <Tabs size="small" tabPosition="left" animated={false} onChange={this.handleTaskOwnerTypeChange}>
        <TabPane tab="My Analyses Results" key="mine">
          {this.renderTabs()}
        </TabPane>

        <TabPane tab="Shared Analyses Results" key="shared">
          {this.renderTabs()}
        </TabPane>
      </Tabs>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  analysisTypes: selectAnalysisTypes,
  analyses: selectAnalyses,
  status: selectAnalysesStatus,
  analysisUsers: selectAnalysisUsers,
  studies: selectStudies,
})

const actions = {
  listAnalysis,
  listAnalysisUser,
  deleteAnalysis,
  listStudy,
}

export default compose(withRouter, connect(selectors, actions))(TaskSection)
