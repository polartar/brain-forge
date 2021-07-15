import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Checkbox, Form, InputNumber, Row } from 'antd'
import { kebabCase, map } from 'lodash'
import { MANCOVA_FEATURES } from 'config/base'
import { pushOrPopToArray } from 'utils/analyses'

const { Item: FormItem } = Form

export default class MancovaOptionEditor extends Component {
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

  handleSetArray = evt => {
    const { value } = evt.target
    const { analysisOptions } = this.props
    const { features } = analysisOptions

    const newValue = pushOrPopToArray(features.value, value)

    this.handleSetOption('features', 'value', newValue)
  }

  includeButtons = () => {
    const { analysisOptions, readOnly } = this.props
    const { features } = analysisOptions

    return (
      <Row>
        {map(MANCOVA_FEATURES, (value, key) => (
          <Col md={6} key={kebabCase(key)}>
            <Checkbox checked={features.value.includes(key)} onChange={this.handleSetArray} disabled={readOnly}>
              {value}
            </Checkbox>
          </Col>
        ))}
      </Row>
    )
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const { TR, p_threshold } = analysisOptions

    return (
      <Row>
        <Col span={24}>
          <FormItem label="Temporal Resolution">
            <InputNumber
              id="TR"
              value={TR.value}
              min={1}
              max={5}
              disabled={readOnly}
              precision={0}
              onChange={value => this.handleSetOption('TR', 'value', value)}
            />
          </FormItem>
          <FormItem label="P-Value Threshold">
            <InputNumber
              id="p_threshold"
              value={p_threshold.value}
              min={0}
              max={1}
              disabled={readOnly}
              precision={0.001}
              onChange={value => this.handleSetOption('p_threshold', 'value', value)}
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Features to Test">{this.includeButtons()}</FormItem>
        </Col>
      </Row>
    )
  }
}
