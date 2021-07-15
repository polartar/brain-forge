import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { concat, first, filter, get } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setAllFiles, setCurrentFiles } from 'store/modules/datafiles'
import { initAnalysisOptions, selectAnalysis, selectAnalysisType, setAnalysisOption } from 'store/modules/analyses'
import { Form } from 'antd'

import { DataFileTree } from 'components'

const { Item: FormItem } = Form

export class WMHUploadSection extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisType: PropTypes.object,
    readOnly: PropTypes.bool,
    initAnalysisOptions: PropTypes.func,
    setAllFiles: PropTypes.func,
    setCurrentFiles: PropTypes.func,
    setAnalysisOption: PropTypes.func,
  }

  state = {
    Master_File: [],
    Base_Image: [],
    test: [],
    training: [],
  }

  componentWillMount() {
    const { analysis } = this.props

    if (analysis) {
      const analysisOptions = analysis.parameters.analysis.options

      this.props.initAnalysisOptions(analysisOptions)
      this.props.setCurrentFiles([analysis.input_file])
    }
  }

  handleSetOption = (optionName, parameterName, value) => {
    this.props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  setAllFiles = () => {
    const { Master_File, Base_Image, test, training } = this.state
    const allFiles = filter(concat(Master_File, Base_Image, test, training))

    if (allFiles) {
      this.props.setAllFiles(allFiles)
      this.props.setCurrentFiles(allFiles)
    }
  }

  handleMasterFileChange = files => {
    this.handleSetOption('Master_File', 'value', first(files))
    this.setState({ Master_File: first(files) }, this.setAllFiles)
  }

  handleBaseImageChange = files => {
    this.handleSetOption('Base_Image', 'value', first(files))
    this.setState({ Base_Image: first(files) }, this.setAllFiles)
  }

  handleSelectTestFiles = files => {
    this.handleSetOption('test', 'value', files)
    this.setState({ test: files }, this.setAllFiles)
  }

  handleSelectTrainingFiles = files => {
    this.handleSetOption('training', 'value', files)
    this.setState({ training: files }, this.setAllFiles)
  }

  render() {
    const { analysis, analysisType, readOnly } = this.props
    const initialOptions = get(analysis, 'parameters.analysis.options')

    return (
      <Fragment>
        <FormItem label="Please select Base Image">
          <DataFileTree
            multiple={true}
            analysisType={analysisType}
            analysis={analysis}
            name={'base-image'}
            disabled={readOnly}
            initialValue={get(initialOptions, 'Base_Image.value')}
            onChange={this.handleBaseImageChange}
          />
        </FormItem>
        <FormItem label="Please select Master File">
          <DataFileTree
            multiple={true}
            analysisType={analysisType}
            name={'master-file'}
            disabled={readOnly}
            analysis={analysis}
            initialValue={get(initialOptions, 'Master_File.value')}
            onChange={this.handleMasterFileChange}
          />
        </FormItem>
        <FormItem label="Please select Test Files">
          <DataFileTree
            multiple={true}
            analysisType={analysisType}
            analysis={analysis}
            name={'test-files'}
            disabled={readOnly}
            initialValue={get(initialOptions, 'test.value')}
            onChange={this.handleSelectTestFiles}
          />
        </FormItem>
        <FormItem label="Please select Training Files">
          <DataFileTree
            multiple={true}
            analysisType={analysisType}
            name={'training-files'}
            disabled={readOnly}
            analysis={analysis}
            initialValue={get(initialOptions, 'training.value')}
            onChange={this.handleSelectTrainingFiles}
          />
        </FormItem>
      </Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
})

const actions = {
  initAnalysisOptions,
  setAllFiles,
  setAnalysisOption,
  setCurrentFiles,
}

export default connect(
  selectors,
  actions,
)(WMHUploadSection)
