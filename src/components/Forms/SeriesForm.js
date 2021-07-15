import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input } from 'antd'
import { find } from 'lodash'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

class SeriesForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    modalities: PropTypes.array,
    mappings: PropTypes.array,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  handleSubmit = evt => {
    evt.preventDefault()

    this.props.form.validateFields((err, values) => {
      /* istanbul ignore next */
      if (err) {
        return
      }

      this.props.onSubmit({ data: values })
    })
  }

  getProtocols = () => {
    const { form, mappings } = this.props

    const { modality } = form.getFieldsValue(['modality'])

    if (!modality) {
      return []
    }

    return mappings
      .filter(mapping => !!find(mapping.modalities, elem => elem.id === modality))
      .map(mapping => mapping.protocol)
  }

  resetProtocol = () => {
    const { form } = this.props
    form.setFieldsValue({ protocol: undefined })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    }

    const { form, modalities, submitting } = this.props
    const { getFieldDecorator } = form

    const protocols = this.getProtocols()

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="Label">
              {getFieldDecorator('label', {
                rules: [{ required: true, message: 'Please input label!' }],
              })(<Input placeholder="Label" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Study code label">
              {getFieldDecorator('study_code_label')(<Input placeholder="Study code label" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Modality">
              {getFieldDecorator('modality', {
                rules: [{ required: true, message: 'Please select modality!' }],
              })(
                <Select onChange={this.resetProtocol} name="modality">
                  {modalities.map(modality => (
                    <Option key={modality.id} value={modality.id}>
                      {modality.full_name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Protocols">
              {getFieldDecorator('protocol')(
                <Select name="protocol">
                  {protocols.map(protocol => (
                    <Option key={protocol.id} value={protocol.id}>
                      {protocol.full_name}
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
              Add
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.props.onCancel} disabled={submitting}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const WrappedForm = Form.create()(SeriesForm)

export default WrappedForm
