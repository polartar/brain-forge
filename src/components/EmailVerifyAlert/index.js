import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Button } from 'antd'

const EmailVerifyAlert = ({ user, sending, onSendEmail }) => {
  const { email, first_name, last_name } = user

  return (
    <Alert
      message={`Please verify your email - ${email}`}
      style={{ marginBottom: 30 }}
      description={
        <div>
          Hi,{' '}
          <b>
            {first_name} {last_name}
          </b>
          <br />
          Your email is not verified yet. Please use below button to get activation email.
          <br />
          <Button type="ghost" style={{ marginTop: 10 }} disabled={sending} loading={sending} onClick={onSendEmail}>
            {sending ? 'Sending...' : 'Send Email'}
          </Button>
        </div>
      }
      type="warning"
      showIcon
      banner
    />
  )
}

EmailVerifyAlert.propTypes = {
  user: PropTypes.object.isRequired,
  sending: PropTypes.bool.isRequired,
  onSendEmail: PropTypes.func.isRequired,
}

export default EmailVerifyAlert
