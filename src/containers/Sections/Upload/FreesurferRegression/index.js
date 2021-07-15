import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { initAnalysisOptions, selectAnalysis, selectAnalysisOptions } from 'store/modules/analyses'
import { setCurrentFiles } from 'store/modules/datafiles'
import { Divider, Row, Typography } from 'antd'
import StudySelect from './StudySelect'
import DefaultUploadSection from '../DefaultUpload'

export class FreesurferRegressionUploadSection extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    initAnalysisOptions: PropTypes.func,
    setCurrentFiles: PropTypes.func,
  }

  componentWillMount() {
    const { analysis } = this.props
    // Initialize analysis options.
    if (analysis) {
      const analysisOptions = analysis.parameters.analysis.options

      this.props.initAnalysisOptions(analysisOptions)
      this.props.setCurrentFiles([analysis.input_file])
    } else {
      this.props.initAnalysisOptions({
        study: { value: '' },
      })
    }
  }

  render() {
    const { Title } = Typography
    return (
      <Fragment>
        <Row>
          <Title level={4}>Choose Study</Title>
          <StudySelect />
        </Row>
        <Divider />
        <Row>
          <Title level={4}>Choose Predictors File</Title>
          <DefaultUploadSection />
        </Row>
      </Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisOptions: selectAnalysisOptions,
})

const actions = {
  initAnalysisOptions,
  setCurrentFiles,
}

export default connect(selectors, actions)(FreesurferRegressionUploadSection)
