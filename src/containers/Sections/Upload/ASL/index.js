import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { first, get } from 'lodash'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setAllFiles, setCurrentFiles } from 'store/modules/datafiles'
import {
  initAnalysisOptions,
  selectAnalysis,
  selectAnalysisType,
  selectAnalysisOptions,
  setAnalysisOption,
} from 'store/modules/analyses'
import { Col, Form, Row } from 'antd'

import { DataFileTree } from 'components'

const { Item: FormItem } = Form

export class ASLUploadSection extends Component {
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

  handleInputImageChange = files => {
    const { analysisOptions } = this.props
    const structuralImage = get(analysisOptions, 'Structural_Image.value')
    const currentFiles = structuralImage ? files.concat(structuralImage) : files

    this.props.setAllFiles(currentFiles)
    this.props.setCurrentFiles(currentFiles)

    this.handleSetOption('Input_Image', 'value', first(files))
  }

  handleStructuralImageChange = files => {
    const { analysisOptions } = this.props
    const inputImage = get(analysisOptions, 'Input_Image.value')
    const currentFiles = inputImage ? files.concat(inputImage) : files

    this.props.setAllFiles(currentFiles)
    this.props.setCurrentFiles(currentFiles)

    this.handleSetOption('Structural_Image', 'value', first(files))
  }

  render() {
    const { analysis, analysisType, readOnly } = this.props

    const initialOptions = get(analysis, 'parameters.analysis.options')

    return (
      <Row>
        <Col md={8}>
          <FormItem label="Please select Input Image">
            <DataFileTree
              multiple={false}
              analysisType={analysisType}
              analysis={analysis}
              name="input-image"
              disabled={readOnly}
              initialValue={get(initialOptions, 'Input_Image.value')}
              onChange={this.handleInputImageChange}
            />
          </FormItem>
        </Col>
        <Col md={8} offset={4}>
          <FormItem label="Please select Structural Image">
            <DataFileTree
              multiple={false}
              analysisType={analysisType}
              name={'structural-image'}
              disabled={readOnly}
              analysis={analysis}
              initialValue={get(initialOptions, 'Structural_Image.value')}
              onChange={this.handleStructuralImageChange}
            />
          </FormItem>
        </Col>
      </Row>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisType: selectAnalysisType,
  analysisOptions: selectAnalysisOptions,
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
)(ASLUploadSection)
