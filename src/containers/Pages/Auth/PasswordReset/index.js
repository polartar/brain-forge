import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { parse } from 'query-string'
import { Button, Icon } from 'antd'
import cx from 'classnames'
import { passwordReset, selectNewPassword, selectAuthStatus, selectAuthError, PASSWORD_RESET } from 'store/modules/auth'
import { successAction, failAction } from 'utils/state-helpers'

export class PasswordResetPage extends Component {
  static propTypes = {
    status: PropTypes.string,
    error: PropTypes.string,
    newPassword: PropTypes.string,
    location: PropTypes.object,
    history: PropTypes.object,
    passwordReset: PropTypes.func,
  }

  componentWillMount() {
    const { location } = this.props
    const { code } = parse(location.search)

    if (code) {
      this.props.passwordReset({ token: code })
    } else {
      this.props.history.push('/login')
    }
  }

  get icon() {
    const { status } = this.props
    const loading = status === PASSWORD_RESET
    const success = status === successAction(PASSWORD_RESET)

    if (loading) {
      return 'loading'
    } else if (success) {
      return 'check-circle'
    }

    return 'exclamation-circle'
  }

  render() {
    const { status, newPassword, error } = this.props

    const loading = status === PASSWORD_RESET
    const success = status === successAction(PASSWORD_RESET)
    const fail = status === failAction(PASSWORD_RESET)

    return (
      <div className="password-reset">
        <div className="password-reset__message">
          <Icon type={this.icon} className={cx('password-reset__icon', { loading, success, fail })} />
          <div style={{ marginTop: 40 }}>
            {loading && <h1>Resetting your password...</h1>}
            {success && (
              <Fragment>
                <h1>Password is resetted.</h1>
                <h3>
                  New password is {newPassword}.<br />
                  You can change this on your profile page.
                  <br />
                  <Link to="/login">
                    <Button type="link">Click here</Button>
                  </Link>{' '}
                  to go to main page.
                </h3>
              </Fragment>
            )}
            {fail && (
              <Fragment>
                <h1>Failed to reset your password.</h1>
                <h3>
                  {error}
                  <br />
                  <Link to="/login">
                    <Button type="link">Click here</Button>
                  </Link>{' '}
                  to go to main page.
                </h3>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  newPassword: selectNewPassword,
  status: selectAuthStatus,
  error: selectAuthError,
})

const actions = {
  passwordReset,
}

export default compose(
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(PasswordResetPage)
