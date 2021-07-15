import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Alert, Card, Button, Row } from 'antd'
import {
  logIn,
  sendPasswordResetEmail,
  selectAuthStatus,
  selectAuthError,
  LOGIN,
  SEND_PASSWORD_RESET_EMAIL,
  selectVersion,
} from 'store/modules/auth'
import { Logo, LogInForm, PasswordResetForm } from 'components'
import { swalCreator } from 'utils/common'
import { successAction, failAction } from 'utils/state-helpers'

export class LogInPage extends Component {
  static propTypes = {
    version: PropTypes.string,
    status: PropTypes.string,
    error: PropTypes.string,
    logIn: PropTypes.func,
    sendPasswordResetEmail: PropTypes.func,
  }

  state = {
    showForgotPasswordForm: false,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status === SEND_PASSWORD_RESET_EMAIL && nextProps.status !== status) {
      const success = nextProps.status === successAction(SEND_PASSWORD_RESET_EMAIL)

      swalCreator(
        success,
        'Check your inbox now.',
        'Successfully sent the password reset email.',
        'Failed to send the password reset email.',
        nextProps.error,
        { button: 'Dismiss' },
      )
    }
  }

  handleLogin = values => {
    this.props.logIn(values)
  }

  handlePasswordReset = values => {
    this.props.sendPasswordResetEmail(values)
  }

  toggleForgotPassword = () => {
    const { showForgotPasswordForm } = this.state
    this.setState({ showForgotPasswordForm: !showForgotPasswordForm })
  }

  render() {
    const { status, error, version } = this.props
    const { showForgotPasswordForm } = this.state
    const loggingIn = status === LOGIN
    const failedLogIn = status === failAction(LOGIN)
    const sendingEmail = status === SEND_PASSWORD_RESET_EMAIL

    return (
      <div className="auth-page">
        <Card className="auth-widget">
          <Logo className="auth-logo" />
          <div className="auth-widget__heading">{!showForgotPasswordForm ? 'Log In' : 'Forgot Password'}</div>
          {failedLogIn && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} banner />}
          {!showForgotPasswordForm ? (
            <LogInForm onSubmit={this.handleLogin} loggingIn={loggingIn} />
          ) : (
            <PasswordResetForm onSubmit={this.handlePasswordReset} sending={sendingEmail} />
          )}
          <Row>
            <Button type="link" disabled={loggingIn} onClick={this.toggleForgotPassword}>
              {!showForgotPasswordForm ? 'Forgot password' : 'Log In'}
            </Button>
          </Row>
          {version && <h5 className="auth-widget__version">v{version}</h5>}
        </Card>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  version: selectVersion,
  status: selectAuthStatus,
  error: selectAuthError,
})

const actions = {
  logIn,
  sendPasswordResetEmail,
}

export default connect(
  selectors,
  actions,
)(LogInPage)
