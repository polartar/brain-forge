import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, isArray } from 'lodash'
import { Col, Form, Input, InputNumber, Radio, Row } from 'antd'

const { Item: FormItem } = Form

export default class WMHOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  state = {
    PatchSizes: {
      status: 'success',
      error: null,
    },
    FeatureSubset: {
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

  handleArrayField = (field, value) => {
    try {
      // Convert value to an array to validate.
      const parsedValue = JSON.parse(value)

      if (!isArray(parsedValue)) {
        throw new Error(`${field} must be an array`)
      }

      this.handleSetOption(field, 'value', parsedValue)

      // Inform user that the field value is validated succesfully.
      this.setState({
        [field]: {
          status: 'success',
          error: null,
        },
      })
    } catch (err) {
      // Set field value to user typed value and insert error msg.
      this.handleSetOption(field, 'value', value)

      this.setState({
        [field]: {
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

  renderRadioGroup = (fieldName, values, extra) => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={fieldName}>
        <Radio.Group
          disabled={readOnly}
          value={get(analysisOptions, [fieldName, 'value'])}
          onChange={evt => this.handleSetOption(fieldName, 'value', evt.target.value)}
        >
          {values.map(value => (
            <Radio value={value} key={value}>
              {value}
            </Radio>
          ))}
        </Radio.Group>
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
    const { PatchSizes, FeatureSubset } = this.state
    const PatchSizesValue = get(analysisOptions, 'PatchSizes.value')
    const FeatureSubsetValue = get(analysisOptions, 'FeatureSubset.value')

    return (
      <Row gutter={24}>
        <Col md={10}>
          {this.renderRadioGroup('Base_Space', ['T1', 'T2', 'FLAIR'])}
          {this.renderInputNumber('BrainMaskFeatureNum', 0)}
          {this.renderInputNumber('QuerySubjectNum', 0)}
          {this.renderInputNumber('LabelFeatureNum', 0)}
          {this.renderInput('TrainingNums', 'all', 'all, or list of ints')}
          {this.renderRadioGroup('SelectPts', ['any', 'noborder', 'surround'])}
          {this.renderInputNumber('TrainingPts', 0)}
          {this.renderInputNumber('NonLesPts', 0)}
        </Col>
        <Col md={10} offset={2}>
          {this.renderSwitch('Patch3D')}
          <FormItem
            label="PatchSizes"
            validateStatus={PatchSizes.status}
            disabled={readOnly}
            help={PatchSizes.error || 'Please enter a separated by comma array of numbers'}
          >
            <Input
              placeholder="[3]"
              disabled={readOnly}
              value={PatchSizes.status === 'success' ? JSON.stringify(PatchSizesValue) : PatchSizesValue}
              onChange={evt => this.handleArrayField('PatchSizes', evt.target.value)}
            />
          </FormItem>
          <FormItem
            label="FeatureSubset"
            validateStatus={FeatureSubset.status}
            disabled={readOnly}
            help={FeatureSubset.error || 'Please enter a separated by comma array of numbers'}
          >
            <Input
              placeholder="[3]"
              disabled={readOnly}
              value={FeatureSubset.status === 'success' ? JSON.stringify(FeatureSubsetValue) : FeatureSubsetValue}
              onChange={evt => this.handleArrayField('FeatureSubset', evt.target.value)}
            />
          </FormItem>
          {this.renderInputNumber('MatFeatureNum', 0)}
          {this.renderInputNumber('SpatialWeight', 0)}
          {this.renderInputNumber('Postprocess_Threshold', 2)}
        </Col>
      </Row>
    )
  }
}
