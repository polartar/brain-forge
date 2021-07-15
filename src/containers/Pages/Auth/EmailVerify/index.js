import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'
import { Button, Icon } from 'antd'
import cx from 'classnames'
import { parse } from 'query-string'
import {
  emailVerify,
  selectLoggedInUser,
  selectLoggedIn,
  selectAuthStatus,
  selectAuthError,
  EMAIL_VERIFY,
} from 'store/modules/auth'
import { successAction, failAction } from 'utils/state-helpers'

export class EmailVerifyPage extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool.isRequired,
    location: PropTypes.object,
    history: PropTypes.object,
    user: PropTypes.object,
    status: PropTypes.string.isRequired,
    error: PropTypes.string,
    emailVerify: PropTypes.func.isRequired,
  }

  componentWillMount() {
    const { location, loggedIn, user } = this.props

    if (loggedIn && user.email_verified) {
      this.props.history.push('/study')
    }

    const { code } = parse(location.search)

    if (code) {
      this.props.emailVerify({ token: code })
    } else {
      this.props.history.push('/login')
    }
  }

  get icon() {
    const { status } = this.props
    const loading = status === EMAIL_VERIFY
    const success = status === successAction(EMAIL_VERIFY)

    if (loading) {
      return 'loading'
    } else if (success) {
      return 'check-circle'
    }

    return 'exclamation-circle'
  }

  render() {
    const { status, error } = this.props
    const loading = status === EMAIL_VERIFY
    const success = status === successAction(EMAIL_VERIFY)
    const fail = status === failAction(EMAIL_VERIFY)

    return (
      <div className="email-verify">
        <div className="email-verify__message">
          <Icon type={this.icon} className={cx('email-verify__icon', { loading, success, fail })} />
          <div style={{ marginTop: 40 }}>
            {loading && <h1>Verifying your email...</h1>}
            {success && (
              <Fragment>
                <h1>Email is verified now.</h1>
                <h3>
                  <Link to="/study">
                    <Button type="link">Click here</Button>
                  </Link>{' '}
                  to go to main page.
                </h3>
              </Fragment>
            )}
            {fail && (
              <Fragment>
                <h1>Failed to verify your email.</h1>
                <h3>
                  {error}
                  <br />
                  <Link to="/login">
                    <Button type="link">Click here</Button>
                  </Link>{' '}
                  to go to login page.
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
  user: selectLoggedInUser,
  loggedIn: selectLoggedIn,
  status: selectAuthStatus,
  error: selectAuthError,
})

const actions = {
  emailVerify,
}

export default compose(
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(EmailVerifyPage)
