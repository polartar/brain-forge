import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { Alert, Button } from 'antd'
import { filter, get, size, values } from 'lodash'
import {
  initAnalysis,
  listAnalysisType,
  setAnalysisType,
  selectAnalysis,
  selectAnalysisType,
  selectAnalysisOptions,
  selectAnalysesStatus,
  LIST_ANALYSIS_TYPE,
  GET_ANALYSIS_TYPE,
} from 'store/modules/analyses'
import {
  listParameterSet,
  selectCurrentFiles,
  selectDataFilesStatus,
  selectParameterSets,
  LIST_PARAMETER_SET,
} from 'store/modules/datafiles'
import { AnalysisConfiguration } from 'containers'
import { Loader } from 'components'
import { ANALYSIS_DISMISS_FILE_SELECT } from 'config/base'

export class AnalysisPredictionSection extends Component {
  static propTypes = {
    analysesStatus: PropTypes.string,
    analysis: PropTypes.object,
    analysisType: PropTypes.object,
    currentFiles: PropTypes.array,
    dataFilesStatus: PropTypes.string,
    history: PropTypes.object,
    initAnalysis: PropTypes.func,
    listParameterSet: PropTypes.func,
    listAnalysisType: PropTypes.func,
    match: PropTypes.object,
    options: PropTypes.object,
    parameterSets: PropTypes.array,
    groupRun: PropTypes.bool,
    setAnalysisType: PropTypes.func,
  }

  static defaultProps = {
    groupRun: false,
  }

  state = {
    initingAnalysis: false,
  }

  componentWillMount() {
    this.props.listAnalysisType()
    this.props.listParameterSet()
  }

  handleRunAnalysis = () => {
    const error = this.validateAnalysis()

    if (error) {
      return
    }

    const { history, match, options } = this.props
    this.props.setAnalysisType(match.params.id, 10)
    this.props.initAnalysis({ options, history })
    this.setState({ initingAnalysis: true })
  }

  validateAnalysis = () => {
    const { analysisType, currentFiles, options, parameterSets } = this.props

    /* istanbul ignore next */
    if (analysisType) {
      const { label } = analysisType
      const isRegression = label === 'Regression'
      const isPolyssifier = label === 'Polyssifier'

      if (isPolyssifier) {
        if (get(currentFiles[0], 'name', '').indexOf('.nii') !== -1) {
          return 'Nii files are not allowed in polyssifier analysis'
        }
      }

      if (isRegression || isPolyssifier) {
        const selectedCount = size(filter(values(get(currentFiles[0], 'fields')), field => field.selected))
        const xCount = size(
          filter(values(get(currentFiles[0], 'fields')), field => field.variable_role === 'x' && field.selected),
        )
        const yCount = size(
          filter(values(get(currentFiles[0], 'fields')), field => field.variable_role === 'y' && field.selected),
        )

        /* istanbul ignore next */
        if (selectedCount === 0) {
          return 'Please select at least one variable'
        } else if (xCount === 0) {
          return 'Please select at least one feature variable'
        } else if (yCount === 0) {
          return 'Please select at least one response variable'
        }
      }
    }

    if (parameterSets.length <= 0) {
      return 'No parameter set to select. Please create parameter set'
    }

    if (!get(options, 'name.value')) {
      return 'Please input analysis name'
    }

    if (!get(options, 'parameter_set.value')) {
      return 'Please select parameter'
    }

    return false
  }

  get pareparingData() {
    const { analysesStatus, dataFilesStatus } = this.props

    return (
      analysesStatus === LIST_ANALYSIS_TYPE ||
      analysesStatus === GET_ANALYSIS_TYPE ||
      dataFilesStatus === LIST_PARAMETER_SET
    )
  }

  renderContent = () => {
    const { analysis, analysisType, currentFiles, groupRun } = this.props
    const { initingAnalysis } = this.state

    if (this.pareparingData) {
      return <Loader />
    }

    /* istanbul ignore next */
    if (!analysis) {
      const noFileSelected = currentFiles.length < 1 || !get(currentFiles, '0.id')
      const dismissFileSelect = analysisType && ANALYSIS_DISMISS_FILE_SELECT.includes(analysisType.label)

      if (noFileSelected && !dismissFileSelect) {
        return <Alert message="No file selected" type="warning" showIcon banner />
      }
    }

    const error = this.validateAnalysis()

    return (
      <Fragment>
        <AnalysisConfiguration />
        {error && <Alert message={error} type="warning" className="mb-2" showIcon banner />}
        <Button type="primary" disabled={initingAnalysis} loading={initingAnalysis} onClick={this.handleRunAnalysis}>
          {groupRun ? 'Run Group Analysis' : 'Run Analysis'}
        </Button>
      </Fragment>
    )
  }

  render() {
    const { groupRun } = this.props
    return (
      <div className="analysis-start-widget">
        <div className="analysis-start-widget-heading">{groupRun ? 'Analysis' : 'Analysis & Prediction'}</div>
        {this.renderContent()}
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  analysisType: selectAnalysisType,
  analysis: selectAnalysis,
  currentFiles: selectCurrentFiles,
  options: selectAnalysisOptions,
  parameterSets: selectParameterSets,
  analysesStatus: selectAnalysesStatus,
  dataFilesStatus: selectDataFilesStatus,
})

const actions = {
  listParameterSet,
  initAnalysis,
  listAnalysisType,
  setAnalysisType,
}

export default withRouter(
  connect(
    selectors,
    actions,
  )(AnalysisPredictionSection),
)
