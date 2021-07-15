import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import MyProfile from './Profile'
import MyNotification from './Notification'
import MyInvite from './Invite'
import { PageLayout } from 'containers/Layouts'
import { Tabs, TabPane } from 'components'

export class MyInfo extends Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
  }

  state = {
    activeTab: 'profile',
  }

  componentWillMount() {
    this.handleNavigation(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.handleNavigation(nextProps)
  }

  handleNavigation = props => {
    const { page } = props.match.params
    const availableTabs = ['profile', 'notification', 'invite']

    if (availableTabs.indexOf(page) !== -1) {
      this.setState({ activeTab: page })
    } else {
      this.props.history.push('/not-found')
    }
  }

  handleTabClick = tab => {
    this.props.history.push(`/me/${tab}`)
  }

  render() {
    const { activeTab } = this.state

    return (
      <PageLayout>
        <Card>
          <Tabs activeKey={activeTab} onTabClick={this.handleTabClick}>
            <TabPane tab="Profile" key="profile">
              <MyProfile />
            </TabPane>
            <TabPane tab="Notifications" key="notification">
              <MyNotification />
            </TabPane>
            <TabPane tab="Received Invites" key="invite">
              <MyInvite />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }
}

export default MyInfo
