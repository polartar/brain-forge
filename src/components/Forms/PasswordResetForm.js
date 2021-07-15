import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Icon, Input, Button } from 'antd'
import validators from './validators'

const FormItem = Form.Item

class PasswordResetForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    sending: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    sending: false,
  }

  handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props

    form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      sending,
    } = this.props

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem hasFeedback>
          {getFieldDecorator('email', validators.email)(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />,
          )}
        </FormItem>
        <Button type="primary" icon="mail" htmlType="submit" disabled={sending} loading={sending}>
          Send Email
        </Button>
      </Form>
    )
  }
}

const PasswordResetFormWrapper = Form.create()(PasswordResetForm)

export default PasswordResetFormWrapper
