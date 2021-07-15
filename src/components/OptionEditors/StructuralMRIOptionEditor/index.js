import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Collapse, Row } from 'antd'
import ReorientForm from './ReorientForm'
import SegmentationForm from './SegmentationForm'
import SmoothingForm from './SmoothingForm'

const { Panel } = Collapse

export default class StructuralMRIOptionEditor extends Component {
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

  render() {
    const { analysisOptions, readOnly } = this.props
    const childProps = {
      analysisOptions,
      readOnly,
      setOption: this.handleSetOption,
    }

    return (
      <Row>
        <Col>
          <Collapse>
            <Panel header="Reorient Options">
              <ReorientForm {...childProps} />
            </Panel>
            <Panel header="Segmentation Options">
              <SegmentationForm {...childProps} />
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
