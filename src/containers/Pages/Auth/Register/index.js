import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Alert, Card } from 'antd'
import { register, selectAuthStatus, selectAuthError, REGISTER, selectVersion } from 'store/modules/auth'
import { Logo, RegisterForm } from 'components'
import { failAction } from 'utils/state-helpers'

export class RegisterPage extends Component {
  static propTypes = {
    version: PropTypes.string,
    status: PropTypes.string,
    error: PropTypes.string,
    register: PropTypes.func.isRequired,
  }

  handleSubmit = values => {
    this.props.register(values)
  }

  render() {
    const { version, status, error } = this.props
    const registering = status === REGISTER
    const failedRegister = status === failAction(REGISTER)

    return (
      <div className="auth-page">
        <Card className="auth-widget">
          <Logo className="auth-logo--register" />
          <h2 className="auth-widget__heading">REGISTER</h2>
          {failedRegister && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} banner />}
          <RegisterForm onSubmit={this.handleSubmit} registering={registering} />
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
  register,
}

export default connect(
  selectors,
  actions,
)(RegisterPage)
