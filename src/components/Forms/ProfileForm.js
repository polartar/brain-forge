import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Form, Icon, Input, Button, Tooltip } from 'antd'
import { forEach, keys, omit } from 'lodash'
import { LANGUAGE } from 'config/base'
import validators from './validators'

const { Item: FormItem } = Form

class ProfileForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    loading: PropTypes.bool,
    user: PropTypes.shape({
      email: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      username: PropTypes.string,
    }),
    error: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
  }

  handleSubmit = evt => {
    evt.preventDefault()
    const { form } = this.props

    form.validateFields((err, values) => {
      if (err) {
        return
      }

      const profile = omit(values, 'confirm')
      this.props.onSubmit(profile)
    })
  }

  compareToFirstPassword = (_rule, value, callback) => {
    const { form } = this.props
    if (value !== form.getFieldValue('password')) {
      callback(LANGUAGE.password.misMatch)
    } else {
      callback()
    }
  }

  validateToNextPassword = (_rule, _value, callback) => {
    const { form } = this.props
    form.validateFields(['confirm'], { force: true })
    callback()
  }

  get canUpdateProfile() {
    const { form, user } = this.props
    const fieldNames = ['email', 'first_name', 'last_name', 'username', 'email', 'password', 'confirm']

    let hasError = false

    forEach(fieldNames, name => {
      if (form.getFieldError(name)) {
        hasError = true
      }
    })

    if (hasError) {
      return false
    }

    let newData = {}
    forEach(fieldNames, name => {
      const value = form.getFieldValue(name)
      if (value) {
        newData[name] = value
      }
    })

    const password = form.getFieldValue('password')

    if (password) {
      return true
    }

    let formChanged = false

    forEach(keys(user), key => {
      if (newData[key] && newData[key] !== user[key]) {
        formChanged = true
      }
    })

    return formChanged
  }

  render() {
    const { form, loading, user, error } = this.props
    const { getFieldDecorator } = form
    const { email, first_name, last_name, username } = user

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
      <div>
        <div className="flex-center">
          <Form onSubmit={this.handleSubmit} style={{ width: 500 }}>
            {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} banner />}
            <FormItem {...formItemLayout} label="First name" hasFeedback>
              {getFieldDecorator('first_name', {
                ...validators.first_name,
                initialValue: first_name,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Last name" hasFeedback>
              {getFieldDecorator('last_name', {
                ...validators.last_name,
                initialValue: last_name,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Username" hasFeedback>
              {getFieldDecorator('username', {
                rules: [...validators.username.rules],
                initialValue: username,
              })(<Input />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  Email&nbsp;
                  <Tooltip title="Verification email will be sent after updating email.">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
              hasFeedback
            >
              {getFieldDecorator('email', {
                ...validators.email,
                initialValue: email,
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="Password">
              {getFieldDecorator('password', { rules: [{ validator: this.validateToNextPassword }] })(
                <Input type="password" />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Confirm Password">
              {getFieldDecorator('confirm', { rules: [{ validator: this.compareToFirstPassword }] })(
                <Input type="password" />,
              )}
            </FormItem>
            <FormItem className="text-right">
              <Button disabled={loading} onClick={this.props.onCancel}>
                Cancel
              </Button>
              <Button
                className="ml-1"
                type="primary"
                htmlType="submit"
                disabled={!this.canUpdateProfile || loading}
                loading={loading}
              >
                Save
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}

const ProfileFormWrapper = Form.create()(ProfileForm)

export default ProfileFormWrapper
