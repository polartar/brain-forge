import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from 'antd'
import { get, map, uniqBy, sortBy } from 'lodash'
import { createStructuredSelector } from 'reselect'
import { setAllFiles, setCurrentFiles } from 'store/modules/datafiles'
import {
  initAnalysisOptions,
  selectAnalysis,
  selectAnalysisOptions,
  selectAnalysisType,
  setAnalysisOption,
} from 'store/modules/analyses'
import { DataFileTree, Select, Option } from 'components'

const { Item: FormItem } = Form

export class FMRI32UploadSection extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisType: PropTypes.object,
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    initAnalysisOptions: PropTypes.func,
    setAllFiles: PropTypes.func,
    setCurrentFiles: PropTypes.func,
    setAnalysisOption: PropTypes.func,
  }

  state = {
    filesSeries: null,
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

  handleTreeChange = files => {
    this.props.setAllFiles(files)
    this.props.setCurrentFiles(files)

    const filesSeries = map(files, 'series')
    const uniqSeries = uniqBy(filesSeries, 'id')
    const sortedSeries = sortBy(uniqSeries, 'label')

    this.setState({ filesSeries: sortedSeries })
  }

  render() {
    const { analysis, analysisType, analysisOptions, readOnly } = this.props
    const { filesSeries } = this.state

    const initialFiles = get(analysisOptions, 'files.value')

    return (
      <div>
        <div className="app-page__subheading">Data Sets</div>
        <FormItem label="Please select datafiles">
          <DataFileTree
            multiple
            analysisType={analysisType}
            analysis={analysis}
            initialValue={initialFiles}
            onChange={this.handleTreeChange}
          />
        </FormItem>
        <FormItem label="Anat">
          <Select
            style={{ width: '100%' }}
            placeholder="Please select Anat serie"
            value={get(analysisOptions, 'Anat.value') || undefined}
            onSelect={value => this.handleSetOption('Anat', 'value', value)}
            disabled={readOnly}
          >
            {map(filesSeries, serie => (
              <Option key={serie.id} value={serie.label}>
                {serie.label}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="Funct">
          <Select
            style={{ width: '100%' }}
            placeholder="Please select Funct serie"
            value={get(analysisOptions, 'Funct.value') || undefined}
            onSelect={value => this.handleSetOption('Funct', 'value', value)}
            disabled={readOnly}
          >
            {map(filesSeries, serie => (
              <Option key={serie.id} value={serie.label}>
                {serie.label}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="SBRef (Optional)">
          <Select
            style={{ width: '100%' }}
            placeholder="Please select SBRef serie (optional)"
            value={get(analysisOptions, 'SBRef.value') || undefined}
            onSelect={value => this.handleSetOption('SBRef', 'value', value)}
            disabled={readOnly}
          >
            <Option key={null} value={null}>
              --------
            </Option>
            {map(filesSeries, serie => (
              <Option key={serie.id} value={serie.label}>
                {serie.label}
              </Option>
            ))}
          </Select>
        </FormItem>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisOptions: selectAnalysisOptions,
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
)(FMRI32UploadSection)
