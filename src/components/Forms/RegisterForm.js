import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Input, Row } from 'antd'
import { LANGUAGE } from 'config/base'
import validators from './validators'

const { Item: FormItem } = Form

class RegistrationForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    registering: PropTypes.bool,
    onSubmit: PropTypes.func,
  }

  static defaultProps = {
    registering: false,
  }

  state = {
    confirmDirty: false,
  }

  handleSubmit = evt => {
    evt.preventDefault()
    const { form } = this.props

    form.validateFields((err, values) => {
      if (!err) {
        this.props.onSubmit(values)
      }
    })
  }

  handleConfirmBlur = evt => {
    const { value } = evt.target
    const { confirmDirty } = this.state
    this.setState({ confirmDirty: confirmDirty || !!value })
  }

  compareToFirstPassword = (_rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback(LANGUAGE.password.misMatch)
    } else {
      callback()
    }
  }

  validateToNextPassword = (_rule, value, callback) => {
    const { form } = this.props
    const { confirmDirty } = this.state
    if (value && confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { form, registering } = this.props
    const { getFieldDecorator } = form

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem label="Name" required>
          <Row gutter={6}>
            <Col xs={12}>
              <FormItem>{getFieldDecorator('first_name', validators.first_name)(<Input />)}</FormItem>
            </Col>
            <Col xs={12}>
              <FormItem>{getFieldDecorator('last_name', validators.last_name)(<Input />)}</FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Username">{getFieldDecorator('username', validators.username)(<Input />)}</FormItem>
        <FormItem label="Email">{getFieldDecorator('email', validators.email)(<Input />)}</FormItem>
        <FormItem label="Password">
          {getFieldDecorator('password', {
            rules: [...validators.password.rules, { validator: this.validateToNextPassword }],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem label="Confirm Password">
          {getFieldDecorator('confirm', {
            rules: [{ required: true, message: LANGUAGE.required }, { validator: this.compareToFirstPassword }],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem>
          <Row gutter={6}>
            <Col xs={12}>
              <Button type="primary" icon="login" htmlType="submit" disabled={registering} loading={registering}>
                Register
              </Button>
            </Col>
            <Col xs={12}>
              <Link to="/login">
                <Button icon="form" disabled={registering}>
                  Log In
                </Button>
              </Link>
            </Col>
          </Row>
        </FormItem>
      </Form>
    )
  }
}

const RegistrationFormWrapper = Form.create()(RegistrationForm)

export default RegistrationFormWrapper
