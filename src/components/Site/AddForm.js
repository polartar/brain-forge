import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input } from 'antd'

const { Item: FormItem } = Form

class SiteAddForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  handleSubmit = evt => {
    evt.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }

      this.props.onSubmit(values)
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    const { form, submitting } = this.props
    const { getFieldDecorator } = form

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="Name" extra="Full name of the site">
              {getFieldDecorator('full_name', {
                rules: [{ required: true, message: 'Please input name!' }],
              })(<Input placeholder="Name" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Label" extra="Abbreviation for site, no spaces">
              {getFieldDecorator('label', {
                rules: [{ required: true, message: 'Please input labe!' }],
              })(<Input placeholder="Label" />)}
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

const WrappedForm = Form.create()(SiteAddForm)

export default WrappedForm
