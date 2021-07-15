import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import swal from 'sweetalert'
import { Descriptions, Icon, Tooltip } from 'antd'
import {
  updateProfile,
  selectLoggedInUser,
  selectAuthStatus,
  selectAuthError,
  UPDATE_PROFILE,
} from 'store/modules/auth'
import { Drawer, CheckIcon, ProfileForm } from 'components'
import { successAction } from 'utils/state-helpers'

const { Item } = Descriptions

export class MyProfile extends Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number,
      email: PropTypes.string,
      email_verified: PropTypes.bool,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      username: PropTypes.string,
      is_superuser: PropTypes.bool,
    }),
    status: PropTypes.string,
    error: PropTypes.string,
    updateProfile: PropTypes.func,
  }

  state = {
    showDrawer: false,
  }

  get loading() {
    const { status } = this.props

    return status === UPDATE_PROFILE
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (status !== nextProps.status && nextProps.status === successAction(UPDATE_PROFILE)) {
      swal({
        title: 'Success',
        text: 'Successfully updated your profile.',
        icon: 'success',
        button: 'Dismiss',
      })

      this.setState({ showDrawer: false })
    }
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state
    this.setState({ showDrawer: !showDrawer })
  }

  handleSubmit = values => {
    this.props.updateProfile(values)
  }

  render() {
    const { user, error } = this.props
    const { showDrawer } = this.state
    const { first_name, last_name, username, email, email_verified, is_superuser } = user

    return (
      <div>
        <div className="app-page__subheading">
          Profile{' '}
          <Icon
            type="edit"
            theme="outlined"
            style={{ marginLeft: 20, fontSize: 20, cursor: 'pointer' }}
            onClick={this.toggleDrawer}
          />
        </div>

        <div className="w-75">
          <Descriptions bordered column={1} size="small">
            <Item label="First name">{first_name}</Item>
            <Item label="Last name">{last_name}</Item>
            <Item label="Username">{username}</Item>
            <Item label="Email">
              {email}
              <Tooltip placement="top" title={`${email_verified ? 'Email is verified' : 'Please verify your email'}`}>
                <span style={{ marginLeft: 5, width: 20 }}>
                  <CheckIcon checked={email_verified} />
                </span>
              </Tooltip>
            </Item>
            <Item label="Role">{is_superuser ? 'Super Admin' : 'User'}</Item>
          </Descriptions>
        </div>

        <Drawer title="Update Profile" visible={showDrawer} onClose={this.toggleDrawer}>
          <ProfileForm
            user={user}
            loading={this.loading}
            error={error}
            onCancel={this.toggleDrawer}
            onSubmit={this.handleSubmit}
          />
        </Drawer>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  user: selectLoggedInUser,
  status: selectAuthStatus,
  error: selectAuthError,
})

const actions = {
  updateProfile,
}

export default connect(
  selectors,
  actions,
)(MyProfile)
