import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import {
  getSite,
  sendInvite,
  deleteInvite,
  setAdmin,
  removeMember,
  selectSite,
  selectSitesStatus,
  selectSitesError,
  GET_SITE,
} from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { Loader, SiteMembers, SiteInvites, SiteAdmin, Tabs, TabPane } from 'components'

export class SiteDetailPage extends Component {
  static propTypes = {
    site: PropTypes.object,
    match: PropTypes.object,
    status: PropTypes.string,
    getSite: PropTypes.func,
    sendInvite: PropTypes.func,
    deleteInvite: PropTypes.func,
    setAdmin: PropTypes.func,
    removeMember: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props
    this.props.getSite(match.params.siteId)
  }

  get loading() {
    const { status } = this.props

    return status === GET_SITE
  }

  render() {
    const { site, status } = this.props

    if (this.loading) {
      return <Loader />
    }

    if (!site) {
      return null
    }

    return (
      <PageLayout heading={site.full_name} subheading={site.description}>
        <Card>
          <Tabs>
            <TabPane tab="Admin" key="0">
              <SiteAdmin site={site} myRole="SuperAdmin" status={status} setAdmin={this.props.setAdmin} />
            </TabPane>
            <TabPane tab="Members" key="1">
              <SiteMembers site={site} myRole="SuperAdmin" status={status} removeMember={this.props.removeMember} />
            </TabPane>
            <TabPane tab="Invites" key="2">
              <SiteInvites
                site={site}
                myRole="SuperAdmin"
                status={status}
                sendInvite={this.props.sendInvite}
                deleteInvite={this.props.deleteInvite}
              />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  site: selectSite,
  status: selectSitesStatus,
  error: selectSitesError,
})

const actions = {
  getSite,
  sendInvite,
  deleteInvite,
  setAdmin,
  removeMember,
}

export default compose(
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(SiteDetailPage)
