import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import { keys } from 'lodash'
import { selectLoggedInUser } from 'store/modules/auth'
import { getScanner, selectScanner, selectSitesStatus, selectSitesError, GET_SCANNER } from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { Loader, Tabs, TabPane } from 'components'

import Info from './Info'
import Chart from './Chart'

export class ScannerDetailPage extends Component {
  static propTypes = {
    user: PropTypes.object,
    scanner: PropTypes.object,
    match: PropTypes.object,
    status: PropTypes.string,
    getScanner: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props
    this.props.getScanner(match.params.scannerId)
  }

  get loading() {
    const { status } = this.props

    return status === GET_SCANNER
  }

  render() {
    const { scanner, user } = this.props

    if (this.loading) {
      return <Loader />
    }

    if (!scanner) {
      return null
    }

    const analyses = scanner.fmri_phantom_qa_analyses
      .filter(analysis => !!analysis.fmri_phantom_qa_data)
      .map(analysis => ({
        ...analysis,
        fmri_phantom_qa_data: analysis.fmri_phantom_qa_data.map(data =>
          keys(data).reduce((acc, elem) => {
            acc[elem] = Number(Number(data[elem]).toFixed(2))
            return acc
          }, {}),
        ),
      }))

    return (
      <PageLayout heading={scanner.full_name} description={scanner.label}>
        <Card>
          <Tabs tabPosition="top">
            <TabPane tab="Info" key="info">
              <Info scanner={scanner} user={user} />
            </TabPane>
            <TabPane tab="Chart" key="chart">
              <Chart phantomAnalyses={analyses} />
            </TabPane>
          </Tabs>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  scanner: selectScanner,
  status: selectSitesStatus,
  error: selectSitesError,
})

const actions = {
  getScanner,
}

export default compose(
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(ScannerDetailPage)
