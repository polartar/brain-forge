import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input } from 'antd'

const { Item: FormItem } = Form

class SessionForm extends Component {
  static propTypes = {
    form: PropTypes.object,
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

    const { form, submitting } = this.props
    const { getFieldDecorator } = form

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="Segment Interval">
              {getFieldDecorator('segment_interval', {
                rules: [{ required: true, message: 'Please input segment interval!' }],
              })(<Input placeholder="Segment Interval" />)}
            </FormItem>
          </Col>
          <Col>
            <FormItem {...formItemLayout} label="Anonymized Scan Date">
              {getFieldDecorator('anonymized_scan_date')(<Input placeholder="Anonymized Scan Date" />)}
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

const WrappedForm = Form.create()(SessionForm)

export default WrappedForm
