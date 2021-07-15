import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, InputNumber, Row } from 'antd'
import { connect } from 'react-redux'
import { fromPairs, get, keys, map } from 'lodash'
import { listDataFile } from 'store/modules/datafiles'
import { Select, Option } from 'components'
import validators from './validators'

const { Item: FormItem } = Form

export class GroupSPMGLMOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    listDataFile: PropTypes.func,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
    form: PropTypes.object,
  }

  static defaultProps = {
    readOnly: false,
  }

  componentWillMount() {
    this.props.listDataFile()
  }

  componentDidMount() {
    const { analysisOptions, form } = this.props

    const formValues = fromPairs(map(keys(validators), key => [key, get(analysisOptions, `${key}.value`)]))
    form.setFieldsValue(formValues)
  }

  handleSetOption = (optionName, parameterName, value) => {
    const { setAnalysisOption } = this.props

    this.props.form.setFieldsValue({ [optionName]: value })
    setAnalysisOption &&
      setAnalysisOption({
        name: optionName,
        option: { [parameterName]: value },
      })
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Row>
        <Col md={24}>
          <FormItem label="Estimation Method">
            <Select
              style={{ minWidth: 300 }}
              defaultValue={'Classical'}
              value={get(analysisOptions, 'Estimation_Method.value', 'Classical')}
              disabled={readOnly}
              onChange={value => this.handleSetOption('Estimation_Method', 'value', value)}
            >
              <Option key="Classical" value="Classical">
                Classical
              </Option>
              <Option key="Bayesian" value="Bayesian">
                Bayesian
              </Option>
              <Option key="Bayesian2" value="Bayesian2">
                2nd Bayesian
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Use FWE Correction">
            <Select
              style={{ minWidth: 300 }}
              defaultValue={true}
              value={get(analysisOptions, 'Use_FWE_Correction.value', true)}
              disabled={readOnly}
              onChange={value => this.handleSetOption('Use_FWE_Correction', 'value', value)}
            >
              <Option key="true" value={true}>
                True
              </Option>
              <Option key="false" value={false}>
                False
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Height Threshold">
            {getFieldDecorator('Height_Threshold', validators.Height_Threshold)(
              <InputNumber
                id="Height_Threshold"
                min={0}
                max={1}
                placeholder={0.001}
                precision={3}
                disabled={readOnly}
                onChange={value => this.handleSetOption('Height_Threshold', 'value', value)}
              />,
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}

const actions = {
  listDataFile,
}

const GroupSPMGLMOptionEditorWrappedForm = Form.create()(GroupSPMGLMOptionEditor)

export default connect(
  null,
  actions,
)(GroupSPMGLMOptionEditorWrappedForm)
