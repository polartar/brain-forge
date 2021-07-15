import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, InputNumber } from 'antd'
import { get } from 'lodash'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

class ScannerForm extends Component {
  static propTypes = {
    sites: PropTypes.array,
    form: PropTypes.object,
    isSuper: PropTypes.bool,
    scanner: PropTypes.object,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  componentDidMount() {
    const { scanner, isSuper } = this.props

    if (scanner) {
      const fieldsValue = Object.assign(
        {
          full_name: get(scanner, 'full_name'),
          label: get(scanner, 'label'),
          model: get(scanner, 'model'),
          manufacturer: get(scanner, 'manufacturer'),
          station: get(scanner, 'station'),
          field_strength: get(scanner, 'field_strength'),
        },
        isSuper && { site: get(scanner, ['site', 'id']) },
      )
      this.props.form.setFieldsValue(fieldsValue)
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()

    const { scanner } = this.props

    this.props.form.validateFields((err, values) => {
      /* istanbul ignore next */
      if (err) {
        return
      }

      this.props.onSubmit({ id: get(scanner, 'id'), data: values })
    })
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

    const { form, isSuper, sites, submitting } = this.props
    const { getFieldDecorator } = form

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          {isSuper && (
            <Col>
              <FormItem {...formItemLayout} label="Site">
                {getFieldDecorator('site', {
                  rules: [{ required: true, message: 'Please select site!' }],
                })(
                  <Select name="site">
                    {sites.map(site => (
                      <Option key={site.id} value={site.id}>
                        {site.full_name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          )}
          <Col>
            <FormItem {...formItemLayout} label="Name" extra="Full name of the scanner">
              {getFieldDecorator('full_name', {
                rules: [{ required: true, message: 'Please input name!' }],
              })(<Input placeholder="Name" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Label" extra="Abbreviation for scanner, no spaces">
              {getFieldDecorator('label', {
                rules: [{ required: true, message: 'Please input label!' }],
              })(<Input placeholder="Label" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Model">
              {getFieldDecorator('model')(<Input placeholder="Model" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Manufacturer">
              {getFieldDecorator('manufacturer')(<Input placeholder="Manufacturer" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Station">
              {getFieldDecorator('station')(<Input placeholder="Station" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Field Strength">
              {getFieldDecorator('field_strength')(
                <InputNumber placeholder="Field Strength" style={{ width: '100%' }} />,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit" disabled={submitting} loading={submitting}>
              Save
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

const WrappedForm = Form.create()(ScannerForm)

export default WrappedForm
