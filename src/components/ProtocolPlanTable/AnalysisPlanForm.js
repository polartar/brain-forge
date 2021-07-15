import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button } from 'antd'
import { get, pick } from 'lodash'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

class AnalysisPlanForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    initialValues: PropTypes.object,
    protocol: PropTypes.number,
    study: PropTypes.number,
    analysisTypes: PropTypes.array,
    modalities: PropTypes.array,
    parameterSets: PropTypes.array,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.state = {
      modalities: [],
      analysis_types: [],
      parameter_sets: [],
    }
  }

  componentDidMount() {
    this.initializeState(this.props)
  }

  initializeState = props => {
    const { initialValues, modalities, analysisTypes, parameterSets } = props

    if (initialValues) {
      props.form.setFieldsValue(pick(initialValues, ['modality', 'analysis_type', 'parameter_set']))

      const { modality, analysis_type } = initialValues

      this.setState({
        modalities: modalities,
        analysis_types: analysisTypes.filter(analysisType => analysisType.modality === modality),
        parameter_sets: parameterSets.filter(parameterSet => parameterSet.analysis_type === analysis_type),
      })

      return
    }

    this.setState({
      modalities: modalities,
      analysis_types:
        modalities.length === 1 ? analysisTypes.filter(analysisType => analysisType.modality === modalities[0].id) : [],
      parameter_sets: [],
    })

    if (modalities.length === 1) {
      props.form.setFieldsValue({ modality: modalities[0].id })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      const { initialValues, protocol, study } = this.props
      const payload = { ...values, id: get(initialValues, 'id'), protocol, study }

      this.props.onSubmit(payload)
    })
  }

  handleChange = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value }, () => this.updateState(key))
  }

  updateState = key => {
    const { modality, analysis_type } = this.props.form.getFieldsValue()

    if (key === 'modality') {
      const { analysisTypes } = this.props

      this.setState({
        analysis_types: analysisTypes.filter(analysisType => analysisType.modality === modality),
        parameter_sets: [],
      })

      this.props.form.setFieldsValue({ analysis_type: null, parameter_set: null })
    } else if (key === 'analysis_type') {
      const { parameterSets } = this.props

      this.setState({
        parameter_sets: parameterSets.filter(parameterSet => parameterSet.analysis_type === analysis_type),
      })

      this.props.form.setFieldsValue({ parameter_set: null })
    }
  }

  render() {
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

    const { form, submitting, initialValues } = this.props
    const { getFieldDecorator } = form
    const { modalities, analysis_types, parameter_sets } = this.state

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="Modality">
              {getFieldDecorator('modality', {
                rules: [{ required: true, message: 'Please select modality!' }],
              })(
                <Select name="modality" onChange={value => this.handleChange('modality', value)}>
                  {modalities.map(modality => (
                    <Option key={modality.id} value={modality.id}>
                      {modality.full_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Analysis">
              {getFieldDecorator('analysis_type', {
                rules: [{ required: true, message: 'Please select analysis!' }],
              })(
                <Select name="analysis_type" onChange={value => this.handleChange('analysis_type', value)}>
                  {analysis_types.map(analysisType => (
                    <Option key={analysisType.id} value={analysisType.id}>
                      {analysisType.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Parameter Set">
              {getFieldDecorator('parameter_set', {
                rules: [{ required: true, message: 'Please select parameter set!' }],
              })(
                <Select name="parameter_set" onChange={value => this.handleChange('parameter_set', value)}>
                  {parameter_sets.map(parameterSet => (
                    <Option key={parameterSet.id} value={parameterSet.id}>
                      {parameterSet.name} - v{parameterSet.version}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
              {initialValues ? 'Save' : 'Add'}
            </Button>
            <Button style={{ marginLeft: 8 }} disabled={submitting} onClick={this.props.onCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(AnalysisPlanForm)

export default WrappedForm
