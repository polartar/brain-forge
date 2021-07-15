import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Col, Row } from 'antd'
import { get } from 'lodash'
import { parse } from 'query-string'
import { createStructuredSelector } from 'reselect'
import { PageLayout } from 'containers/Layouts'
import { AnalysisPredictionSection, UploadSection } from 'containers'
import { Loader } from 'components'
import {
  getAnalysis,
  getAnalysisType,
  selectAnalysis,
  selectAnalysisType,
  setAnalysis,
  clearAnalysisOptions,
} from 'store/modules/analyses'
import { ANALYSIS_LARGE_UPLOAD, ANALYSIS_DISMISS_UPLOAD } from 'config/base'

export class AnalysisStartPage extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisType: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    getAnalysisType: PropTypes.func,
    setAnalysis: PropTypes.func,
    clearAnalysisOptions: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { analysisId } = props.location ? parse(props.location.search) : {}

    this.state = {
      analysisId,
    }
  }

  componentWillMount() {
    const { match } = this.props
    const { analysisId } = this.state
    this.props.getAnalysisType(match.params.analysisType)

    analysisId && this.props.getAnalysis(analysisId)
  }

  componentWillUnmount() {
    const { analysis } = this.props
    analysis && this.props.setAnalysis(null)

    this.props.clearAnalysisOptions()
  }

  get isUploadFocusAnalysis() {
    const { analysisType } = this.props
    return ANALYSIS_LARGE_UPLOAD.includes(get(analysisType, 'label'))
  }

  get isUploadRequired() {
    const { analysisType } = this.props
    return !ANALYSIS_DISMISS_UPLOAD.includes(get(analysisType, 'label'))
  }

  render() {
    const { analysis, analysisType } = this.props
    const { analysisId } = this.state
    const isAnalysisLoaded = Boolean(!analysisId || (analysisId && analysis))

    if (!analysisType) {
      return <Loader />
    }

    return (
      <PageLayout heading={`${analysisType.label} | Create Analysis`} subheading={analysisType.description}>
        <Row gutter={20}>
          <Col md={this.isUploadFocusAnalysis ? 14 : 12}>
            {this.isUploadRequired && <Card className="mt-1">{isAnalysisLoaded ? <UploadSection /> : <Loader />}</Card>}
          </Col>
          <Col md={this.isUploadFocusAnalysis ? 10 : 12}>
            <Card className="mt-1">{isAnalysisLoaded && <AnalysisPredictionSection />}</Card>
          </Col>
        </Row>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
})

const actions = {
  getAnalysis,
  getAnalysisType,
  setAnalysis,
  clearAnalysisOptions,
}

export default connect(
  selectors,
  actions,
)(AnalysisStartPage)
