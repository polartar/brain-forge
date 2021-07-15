import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import { selectLoggedInUser } from 'store/modules/auth'
import { listParameterSet } from 'store/modules/datafiles'
import { PageLayout } from 'containers/Layouts'
import { Tabs, TabPane } from 'components'
import ParameterSetTable from './ParameterSetTable'

export class ParameterSetListPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    listParameterSet: PropTypes.func,
  }

  state = {
    activeTab: 'mine',
  }

  componentWillMount() {
    const params = { shared: 'off' }
    this.props.listParameterSet({ params })
  }

  switchTab = activeTab => {
    this.setState({ activeTab })
    const params = { shared: activeTab === 'shared' ? 'on' : 'off' }
    this.props.listParameterSet({ params })
  }

  renderContent = () => {
    const { user } = this.props
    const { activeTab } = this.state

    if (user.is_superuser) {
      return <ParameterSetTable user={user} shared={false} />
    }

    return (
      <Tabs activeKey={activeTab} onChange={this.switchTab}>
        <TabPane tab="My Parameter Sets" key="mine">
          <ParameterSetTable user={user} title="My Parameter Sets" shared={false} />
        </TabPane>
        <TabPane tab="Shared Parameter Sets" key="shared">
          <ParameterSetTable user={user} title="Shared Parameter Sets" shared={true} />
        </TabPane>
      </Tabs>
    )
  }

  render() {
    return (
      <PageLayout heading="Parameter Sets">
        <Card>{this.renderContent()}</Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
})

const actions = {
  listParameterSet,
}

export default connect(
  selectors,
  actions,
)(ParameterSetListPage)
