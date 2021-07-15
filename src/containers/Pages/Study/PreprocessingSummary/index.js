import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import { getStudy, selectStudy, selectSitesStatus } from 'store/modules/sites'
import { PreprocessingSummaryTable } from 'containers'
import { getFullname } from 'utils/common'
import { PageLayout } from 'containers/Layouts'

export class PreprocessingSummaryPage extends Component {
  static propTypes = {
    match: PropTypes.object,
    study: PropTypes.object,
    getStudy: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props

    this.props.getStudy(match.params.studyLabel)
  }

  render() {
    const { study } = this.props

    if (!study) {
      return null
    }

    return (
      <PageLayout
        heading={study.full_name}
        subheading={`Principal Investigator: ${getFullname(study.principal_investigator)}`}
      >
        <Card>
          <PreprocessingSummaryTable study={study} />
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  study: selectStudy,
  status: selectSitesStatus,
})

const actions = {
  getStudy,
}

export default connect(
  selectors,
  actions,
)(PreprocessingSummaryPage)
