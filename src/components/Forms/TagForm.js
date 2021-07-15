import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input } from 'antd'
import { get } from 'lodash'

const { Item: FormItem } = Form

class TagForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    tag: PropTypes.object,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  componentDidMount() {
    const { tag } = this.props

    if (tag) {
      this.props.form.setFieldsValue({
        label: get(tag, 'label'),
      })
    }
  }

  handleSubmit = evt => {
    evt.preventDefault()

    const { tag } = this.props

    this.props.form.validateFields((err, values) => {
      /* istanbul ignore next */
      if (err) {
        return
      }

      this.props.onSubmit({ id: get(tag, 'id'), data: values })
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

    const { form, submitting } = this.props
    const { getFieldDecorator } = form

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Row gutter={24}>
          <Col>
            <FormItem {...formItemLayout} label="Label" extra="Label for Tag">
              {getFieldDecorator('label', {
                rules: [{ required: true, message: 'Please input label!' }],
              })(<Input placeholder="Label" />)}
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

const WrappedForm = Form.create()(TagForm)

export default WrappedForm
