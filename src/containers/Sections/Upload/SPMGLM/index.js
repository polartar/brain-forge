import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Alert, Form } from 'antd'
import { connect } from 'react-redux'
import { successAction } from 'utils/state-helpers'
import { createStructuredSelector } from 'reselect'
import { setCurrentFiles } from 'store/modules/datafiles'
import { ANALYSIS_RESULTS, ANALYSIS_TYPES_ID } from 'config/base'
import {
  LIST_ANALYSIS,
  listAnalysis,
  selectAnalysis,
  initAnalysisOptions,
  selectAnalysesStatus,
} from 'store/modules/analyses'
import { Loader } from 'components'

import RunsOptionEditor from './RunsOptionEditor'
import ContrastsOptionEditor from './ContrastsOptionEditor'

const { Item: FormItem } = Form

export class SPMGLMUploadSection extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    readOnly: PropTypes.bool,
    initAnalysisOptions: PropTypes.func,
    analysesStatus: PropTypes.string,
    listAnalysis: PropTypes.func,
    setCurrentFiles: PropTypes.func,
  }

  state = {
    numOnsets: 0,
    isAnalysesLoaded: false,
  }

  componentWillMount() {
    const { analysis } = this.props

    if (analysis) {
      const analysisOptions = analysis.parameters.analysis.options

      this.props.initAnalysisOptions(analysisOptions)
      this.props.setCurrentFiles([analysis.input_file])
    } else {
      this.props.initAnalysisOptions({
        Runs: { value: [] },
        Contrasts: { value: [] },
      })
    }

    const params = {
      pageSize: 1000,
      analysis_type: ANALYSIS_TYPES_ID.fMRI,
      status: ANALYSIS_RESULTS.Complete,
    }

    this.props.listAnalysis({ params })
  }

  componentDidUpdate() {
    const { analysesStatus } = this.props
    const { isAnalysesLoaded } = this.state

    // Detect when analyses has been loaded from the initialization in componentDidMount.
    if (!isAnalysesLoaded && analysesStatus === successAction(LIST_ANALYSIS)) {
      this.setState({ isAnalysesLoaded: true })
    }
  }

  render() {
    const { readOnly } = this.props
    const { isAnalysesLoaded } = this.state

    if (this.loading) {
      return <Loader />
    }

    return (
      <Fragment>
        <FormItem label="Runs Configuration">
          {isAnalysesLoaded ? (
            <RunsOptionEditor readOnly={readOnly} setNumOnSets={num => this.setState({ numOnsets: num })} />
          ) : (
            <Alert message="Loading analyses in Run Configuration" type="info" className="mb-2" showIcon banner />
          )}
        </FormItem>
        <FormItem label="Contrasts">
          <ContrastsOptionEditor readOnly={readOnly} numOnsets={this.state.numOnsets} />
        </FormItem>
      </Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysesStatus: selectAnalysesStatus,
})

const actions = {
  initAnalysisOptions,
  listAnalysis,
  setCurrentFiles,
}

export default connect(
  selectors,
  actions,
)(SPMGLMUploadSection)
