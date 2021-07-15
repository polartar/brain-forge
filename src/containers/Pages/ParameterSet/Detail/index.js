import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card, Tabs } from 'antd'
import {
  listUser,
  getProfile,
  selectLoggedInUser,
  selectUsers,
  selectAuthStatus,
  LIST_USER,
  GET_PROFILE,
} from 'store/modules/auth'
import { selectAnalysisTypes } from 'store/modules/analyses'
import {
  getParameterSet,
  updateParameterSet,
  selectParameterSet,
  selectDataFilesStatus,
  GET_PARAMETER_SET,
} from 'store/modules/datafiles'
import { PageLayout } from 'containers/Layouts'
import { Loader } from 'components'
import { isSharedData } from 'utils/common'
import SharedUsers from './SharedUsers'
import ParameterSetInfo from './ParameterSetInfo'
const { TabPane } = Tabs

export class ParameterSetDetailPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.array,
    analysisTypes: PropTypes.array,
    parameterSet: PropTypes.object,
    match: PropTypes.object,
    status: PropTypes.string,
    authStatus: PropTypes.string,
    listUser: PropTypes.func,
    getProfile: PropTypes.func,
    getParameterSet: PropTypes.func,
    updateParameterSet: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props

    this.props.listUser()
    this.props.getParameterSet(match.params.parameterSetId)
    this.props.getProfile()
  }

  get preparing() {
    const { status, authStatus } = this.props

    return [GET_PARAMETER_SET].indexOf(status) !== -1 || [LIST_USER, GET_PROFILE].indexOf(authStatus) !== -1
  }

  render() {
    const { parameterSet, user, users, analysisTypes, status, updateParameterSet } = this.props

    if (this.preparing) {
      return <Loader />
    }

    if (!parameterSet) {
      return null
    }

    const subProps = {
      parameterSet,
      user,
      users,
      analysisTypes,
      status,
      editable: user.is_superuser || !isSharedData(parameterSet.shared_users, user),
      updateParameterSet,
    }

    return (
      <PageLayout heading={parameterSet.name}>
        <Card>
          <Tabs animated={false}>
            <TabPane tab="Parameter Set Info" key="0">
              <ParameterSetInfo {...subProps} />
            </TabPane>
            <TabPane tab="Shared Users" key="2">
              <SharedUsers {...subProps} />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  analysisTypes: selectAnalysisTypes,
  user: selectLoggedInUser,
  users: selectUsers,
  parameterSet: selectParameterSet,
  status: selectDataFilesStatus,
  authStatus: selectAuthStatus,
})

const actions = {
  listUser,
  getProfile,
  getParameterSet,
  updateParameterSet,
}

export default connect(
  selectors,
  actions,
)(ParameterSetDetailPage)
