import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, InputNumber, Checkbox, Row } from 'antd'
import { kebabCase, map } from 'lodash'
import { INCLUDE } from 'config/base'
import { pushOrPopToArray } from 'utils/analyses'

const { Item: FormItem } = Form

export default class PolyssifierOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  handleSetArray = evt => {
    const { value } = evt.target
    const { analysisOptions } = this.props
    const { include } = analysisOptions

    const newValue = pushOrPopToArray(include.value, value)

    this.handleSetOption('include', 'value', newValue)
  }

  handleSetOption = (optionName, parameterName, value) => {
    const { setAnalysisOption } = this.props

    setAnalysisOption &&
      setAnalysisOption({
        name: optionName,
        option: { [parameterName]: value },
      })
  }

  includeButtons = () => {
    const { analysisOptions, readOnly } = this.props
    const { include } = analysisOptions

    return (
      <Row>
        {map(INCLUDE, (value, key) => (
          <Col md={6} key={kebabCase(key)}>
            <Checkbox checked={include.value.includes(key)} onChange={this.handleSetArray} disabled={readOnly}>
              {value}
            </Checkbox>
          </Col>
        ))}
      </Row>
    )
  }

  render() {
    const { analysisOptions, readOnly } = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Row>
        <Col md={24} lg={12}>
          <FormItem label="Number of Folds" {...formItemLayout}>
            <InputNumber
              id="n_folds"
              value={analysisOptions.n_folds.value}
              min={2}
              max={10}
              disabled={readOnly}
              precision={0}
              onChange={value => this.handleSetOption('n_folds', 'value', value)}
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem label="Classifiers to Run">{this.includeButtons()}</FormItem>
        </Col>
      </Row>
    )
  }
}
