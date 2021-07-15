import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { first, get } from 'lodash'
import { Col, Collapse, Divider, Form, Input, InputNumber, Radio, Row } from 'antd'

import { Select, Option, MiscFileTree } from 'components'
import { DTI_CONFIG_OPTIONS } from 'config/base'

const { Item: FormItem } = Form
const { Panel } = Collapse

export default class DTIOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  toggleDrawer = key => {
    this.setState({ [key]: !this.state[key] })
  }

  handleSetOption = (optionName, parameterName, value) => {
    const { setAnalysisOption } = this.props
    setAnalysisOption &&
      setAnalysisOption({
        name: optionName,
        option: { [parameterName]: value },
      })
  }

  renderInput = (fieldName, placeholder) => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={fieldName}>
        <Input
          placeholder={placeholder}
          disabled={readOnly}
          value={get(analysisOptions, [fieldName, 'value'])}
          onChange={evt => this.handleSetOption(fieldName, 'value', evt.target.value)}
        />
      </FormItem>
    )
  }

  renderSelect = (fieldName, fieldOptions) => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={fieldName}>
        <Select
          className="w-50"
          name={fieldName}
          disabled={readOnly}
          value={get(analysisOptions, [fieldName, 'value'])}
          onChange={value => this.handleSetOption(fieldName, 'value', value)}
        >
          {fieldOptions.map(option => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </FormItem>
    )
  }

  renderInputNumber = (fieldName, precision) => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={fieldName}>
        <InputNumber
          className="w-100"
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

  renderUseCuda = () => {
    const { analysisOptions, readOnly } = this.props

    const wrapperStyle = {
      display: 'flex',
      alignItems: 'center',
      height: 40,
    }

    return (
      <Panel header="CUDA Parameters" key="panel">
        <Row>
          <Col md={10}>
            {this.renderInputNumber('Mporder', 0)}
            {this.renderInputNumber('Niter', 0)}
            {this.renderSelect('Config', DTI_CONFIG_OPTIONS)}
            <FormItem label="Slice Order Acquisition">
              <div style={wrapperStyle}>
                <MiscFileTree
                  multiple={false}
                  disabled={readOnly}
                  initialValue={get(analysisOptions, ['Slice_File', 'value'])}
                  onChange={files => this.handleSetOption('Slice_File', 'value', first(files).id)}
                />
              </div>
            </FormItem>
          </Col>
          <Col md={10} offset={2}>
            {this.renderInputNumber('Slice2Vol_Lambda', 0)}
            {this.renderInputNumber('Slice2Vol_Niter', 0)}
            {this.renderInput('Slice2Vol_Interp', 'trilinear')}
            {this.renderInput('tres_per_node', 'gpu:1')}
          </Col>
        </Row>
      </Panel>
    )
  }

  renderUseRegular = () => {
    return (
      <Panel header="Regular Parameters" key="panel">
        <Row>
          <Col md={10}>
            {this.renderSwitch('Estimate_Skeleton')}
            {this.renderSwitch('Is_Shelled')}
          </Col>
          <Col md={10} offset={2}>
            {this.renderInputNumber('Multiband_Factor', 0)}
          </Col>
        </Row>
      </Panel>
    )
  }

  render() {
    const { analysisOptions } = this.props
    const useCuda = get(analysisOptions, ['Use_Cuda', 'value'])

    return (
      <Fragment>
        <Row gutter={24}>
          <Col md={10}>
            {this.renderSwitch('Mask')}
            {this.renderSwitch('Repol')}
            {this.renderSwitch('Use_Cuda')}
          </Col>
          <Col md={10} offset={2}>
            {this.renderInputNumber('Frac', 2)}
            {this.renderInputNumber('Sigma', 2)}
            {this.renderInput('Tag', '32ch')}
          </Col>
        </Row>
        <Divider />
        <Row gutter={24}>
          <Col md={24}>
            <Collapse defaultActiveKey={'panel'}>{useCuda ? this.renderUseCuda() : this.renderUseRegular()}</Collapse>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
