import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Input, Radio, Row } from 'antd'
import { kebabCase, capitalize, map } from 'lodash'
import { generateFormula } from 'utils/formulas'
import { FORMULA_TYPES } from 'config/base'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

export default class RegressionOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    file: PropTypes.object,
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

  handleFormulaTypeChange = evt => {
    this.handleSetOption('formula', 'value', evt.target.value)
  }

  renderFormulas = () => (
    <RadioGroup
      onChange={this.handleFormulaTypeChange}
      value={this.props.analysisOptions.formula.value}
      disabled={this.props.readOnly}
      style={{ width: '100%' }}
    >
      <Row>
        {map(FORMULA_TYPES, (value, index) => (
          <Col md={6} key={kebabCase(value)}>
            <Radio value={value}>{capitalize(value)}</Radio>
          </Col>
        ))}
      </Row>
    </RadioGroup>
  )

  getFormulaValue = (analysisOptions, file) => {
    const { formula, formulaEdit } = analysisOptions

    if (formula.value === 'custom') {
      return formulaEdit.value
    }

    return generateFormula(formula.value, formulaEdit.value, file.fields)
  }

  render() {
    const { analysisOptions, file } = this.props

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
          <FormItem label="Formula:" {...formItemLayout}>
            <Input
              type="text"
              id="formulaEdit"
              value={this.getFormulaValue(analysisOptions, file)}
              disabled={analysisOptions.formula.value !== 'custom'}
              onChange={evt => this.handleSetOption('formulaEdit', 'value', evt.target.value)}
            />
          </FormItem>
        </Col>
        <Col span={24}>
          <FormItem>{this.renderFormulas()}</FormItem>
        </Col>
      </Row>
      // Regression Drop Missing
      // TODO
    )
  }
}
