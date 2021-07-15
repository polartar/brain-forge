import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import {
  sendVerifyEmail,
  selectLoggedInUser,
  selectAuthStatus,
  selectAuthError,
  SEND_VERIFY_EMAIL,
} from 'store/modules/auth'
import { TaskSection } from 'containers'
import { EmailVerifyAlert } from 'components'
import { successAction } from 'utils/state-helpers'
import { swalCreator } from 'utils/common'
import { PageLayout } from 'containers/Layouts'

export class StatusPage extends Component {
  static propTypes = {
    status: PropTypes.string,
    user: PropTypes.object.isRequired,
    error: PropTypes.string,
    sendVerifyEmail: PropTypes.func,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status === SEND_VERIFY_EMAIL && nextProps.status !== status) {
      const success = nextProps.status === successAction(SEND_VERIFY_EMAIL)

      swalCreator(
        success,
        'Check your inbox now.',
        'Successfully sent the verification email.',
        'Failed to send the verification email.',
        nextProps.error,
        { button: 'Dismiss' },
      )
    }
  }

  render() {
    const { user, status } = this.props
    const { email_verified } = user

    const sending = status === SEND_VERIFY_EMAIL

    return (
      <PageLayout heading="Analysis Status">
        {!email_verified && <EmailVerifyAlert user={user} sending={sending} onSendEmail={this.props.sendVerifyEmail} />}
        <Card>
          <TaskSection />
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  status: selectAuthStatus,
  error: selectAuthError,
})

const actions = {
  sendVerifyEmail,
}

export default connect(
  selectors,
  actions,
)(StatusPage)
