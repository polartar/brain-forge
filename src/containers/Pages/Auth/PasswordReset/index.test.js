import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Icon } from 'antd'
import { PASSWORD_RESET } from 'store/modules/auth'
import { successAction, failAction } from 'utils/state-helpers'
import { PasswordResetPage } from './index'

const initialProps = {
  status: PASSWORD_RESET,
  error: null,
  newPassword: null,
  passwordReset: jest.fn(),
  location: {
    search: '?code=123',
  },
  history: {
    push: jest.fn(),
  },
}

describe('PasswordResetPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PasswordResetPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Icon).prop('type')).toBe('loading')
    expect(initialProps.passwordReset).toHaveBeenCalledTimes(1)
  })

  it('should show error message', () => {
    const error = 'error'
    wrapper.setProps({ status: failAction(PASSWORD_RESET), error })

    expect(wrapper.find(Icon).prop('type')).toBe('exclamation-circle')
  })

  it('should show success message', () => {
    const newPassword = 'password'
    wrapper.setProps({ status: successAction(PASSWORD_RESET), newPassword })

    expect(wrapper.find(Icon).prop('type')).toBe('check-circle')
  })

  it('should redirect to login page', () => {
    const props = update(initialProps, {
      location: { search: { $set: null } },
      history: { push: { $set: jest.fn() } },
    })
    wrapper = shallow(<PasswordResetPage {...props} />)

    expect(props.history.push).toHaveBeenCalledTimes(1)
  })
})
