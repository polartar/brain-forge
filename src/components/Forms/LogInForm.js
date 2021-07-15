import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Col, Form, Icon, Input, Row } from 'antd'
import validators from './validators'

const FormItem = Form.Item

class LogInForm extends Component {
  static propTypes = {
    loggingIn: PropTypes.bool,
    form: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    loggingIn: false,
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
    const {
      form: { getFieldDecorator },
      loggingIn,
    } = this.props

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row>
          <Col>
            <FormItem hasFeedback>
              {getFieldDecorator('username', validators.username)(
                <Input
                  name="username"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username or Email"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormItem hasFeedback>
              {getFieldDecorator('password', validators.password)(
                <Input
                  name="password"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={6}>
          <Col xs={12}>
            <Button type="primary" icon="login" htmlType="submit" disabled={loggingIn} loading={loggingIn}>
              Log In
            </Button>
          </Col>
          <Col xs={12}>
            <Link to="/register">
              <Button icon="form" disabled={loggingIn}>
                Register
              </Button>
            </Link>
          </Col>
        </Row>
      </Form>
    )
  }
}

const LogInFormWrapper = Form.create()(LogInForm)

export default LogInFormWrapper
