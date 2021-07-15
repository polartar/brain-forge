import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Collapse, Row } from 'antd'
import ReorientForm from './ReorientForm'
import RealignForm from './RealignForm'
import NormalizeForm from './NormalizeForm'
import SmoothingForm from './SmoothingForm'
import SliceTimingCorrectionForm from './SliceTimingCorrectionForm'
import DistortionForm from './DistortionForm'
import ScansForm from './ScansForm'

const { Panel } = Collapse

export default class FunctionalMRIPreprocOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  handleSetOption = (optionName, parameterName, value) => {
    const { setAnalysisOption } = this.props
    setAnalysisOption &&
      setAnalysisOption({
        name: optionName,
        option: { [parameterName]: value },
      })
  }

  handleAcquisitionChange = e => {
    const { value } = e.target
    this.handleSetOption('acquisition_order', 'value', value)
  }

  render() {
    const { analysisOptions, readOnly } = this.props

    const childProps = {
      analysisOptions,
      readOnly,
      setOption: this.handleSetOption,
    }

    return (
      <Row>
        <Col className="mb-1">
          <Collapse>
            <Panel header="Discard Dummy Scans Options">
              <ScansForm {...childProps} />
            </Panel>
            <Panel header="Distortion Correction Options">
              <DistortionForm {...childProps} />
            </Panel>
            <Panel header="Reorient Options">
              <ReorientForm {...childProps} />
            </Panel>
            <Panel header="Slice Timing Correction Options">
              <SliceTimingCorrectionForm {...childProps} />
            </Panel>
            <Panel header="Realign Options">
              <RealignForm {...childProps} />
            </Panel>
            <Panel header="Normalize Options">
              <NormalizeForm {...childProps} />
            </Panel>
            <Panel header="Smoothing Options">
              <SmoothingForm {...childProps} />
            </Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }
}
