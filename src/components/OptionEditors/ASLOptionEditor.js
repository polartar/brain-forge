import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, isArray } from 'lodash'
import { Col, Form, Input, InputNumber, Radio, Row } from 'antd'

const { Item: FormItem } = Form

export default class ASLOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  state = {
    TIs: {
      status: 'success',
      error: null,
    },
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

  handleTIs = value => {
    try {
      // Convert value to an array to validate.
      const tisValue = JSON.parse(value)

      if (!isArray(tisValue)) {
        throw new Error('TIs must be an array')
      }

      this.handleSetOption('TIs', 'value', tisValue)

      // Inform user that the field value is validated succesfully.
      this.setState({
        TIs: {
          status: 'success',
          error: null,
        },
      })
    } catch (err) {
      // Set field value to user typed value and insert error msg.
      this.handleSetOption('TIs', 'value', value)

      this.setState({
        TIs: {
          status: 'error',
          error: 'Please enter a comma-separated array of numbers. For example: [6, 6, 6]',
        },
      })
    }
  }

  renderInput = (fieldName, placeholder, extra) => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={fieldName} extra={extra}>
        <Input
          placeholder={placeholder}
          disabled={readOnly}
          value={get(analysisOptions, [fieldName, 'value'])}
          onChange={evt => this.handleSetOption(fieldName, 'value', evt.target.value)}
        />
      </FormItem>
    )
  }

  renderInputNumber = (fieldName, precision = 2, extra = '') => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={fieldName} extra={extra}>
        <InputNumber
          style={{ width: '100%' }}
          value={get(analysisOptions, [fieldName, 'value'])}
          disabled={readOnly}
          precision={precision}
          onChange={value => this.handleSetOption(fieldName, 'value', value)}
        />
      </FormItem>
    )
  }

  renderSwitch = fieldName => {
    const { analysisOptions, readOnly } = this.props
    return (
      <FormItem label={fieldName}>
        <Radio.Group
          disabled={readOnly}
          value={get(analysisOptions, [fieldName, 'value'])}
          onChange={evt => this.handleSetOption(fieldName, 'value', evt.target.value)}
        >
          <Radio value={false}>false</Radio>
          <Radio value={true}>true</Radio>
        </Radio.Group>
      </FormItem>
    )
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const { TIs } = this.state
    const TisValue = get(analysisOptions, 'TIs.value')

    return (
      <Row gutter={24}>
        <Col md={6}>
          <FormItem
            label="TIs - list of inflow-times"
            validateStatus={TIs.status}
            disabled={readOnly}
            help={TIs.error || 'Please enter a separated by comma array of numbers'}
          >
            <Input
              placeholder="[2, 7]"
              disabled={readOnly}
              value={TIs.status === 'success' ? JSON.stringify(TisValue) : TisValue}
              onChange={evt => this.handleTIs(evt.target.value)}
            />
          </FormItem>
          {this.renderInput('IAF - Input ASL format', 'tc', 'diff, tc or ct')}
          {this.renderInput('IBF - Input block format', 'rpt', 'rpt or tis')}
          {this.renderInput('Calib_Method - Calibration method', 'voxel', 'single or voxel')}
        </Col>
        <Col md={6} offset={2}>
          {this.renderInputNumber('Bolus_Duration - ASL labelling bolus duration')}
          {this.renderInputNumber('T1b - T1 value of arterial blood')}
          {this.renderInputNumber('TR_Calib - TR of calibration image')}
          {this.renderInputNumber('CGain - Relative gain btw Calibration & ASL image')}
          {this.renderInputNumber('Alpha - Inversion efficiency', 2, '0.98 (pASL); 0.85 (cASL)')}
        </Col>
        <Col md={8} offset={2}>
          {this.renderSwitch('ASL_Type - Data acquired labelling')}
          {this.renderSwitch('WP - Data acquired labelling')}
          {this.renderSwitch('Spatial_Flag - Automatic spatial smoothing of CBF')}
          {this.renderSwitch('Artoff - Do not infer arterial signal')}
          {this.renderSwitch('Fixbolus - Bolus duration is fixed')}
        </Col>
      </Row>
    )
  }
}
