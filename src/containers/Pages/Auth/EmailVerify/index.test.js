import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Icon } from 'antd'
import { EMAIL_VERIFY } from 'store/modules/auth'
import { successAction, failAction } from 'utils/state-helpers'
import { UserMock } from 'test/mocks'
import { EmailVerifyPage } from './index'

const initialProps = {
  location: {
    search: '?code=123',
  },
  loggedIn: true,
  status: EMAIL_VERIFY,
  user: {
    ...UserMock(),
    email_verified: false,
  },
  error: null,
  emailVerify: jest.fn(),
  history: {
    push: jest.fn(),
  },
}

describe('EmailVerifyPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<EmailVerifyPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Icon).prop('type')).toBe('loading')
    expect(wrapper.find('h1').length).toBe(1)
    expect(initialProps.emailVerify).toHaveBeenCalledTimes(1)
  })

  it('should redirect to study page', () => {
    const props = update(initialProps, {
      loggedIn: { $set: true },
      user: { email_verified: { $set: true } },
      history: { push: { $set: jest.fn() } },
    })
    wrapper = shallow(<EmailVerifyPage {...props} />)
    expect(props.history.push).toHaveBeenCalledWith('/study')
  })

  it('should redirect to login page', () => {
    const props = update(initialProps, {
      location: { search: { $set: null } },
      history: { push: { $set: jest.fn() } },
    })
    wrapper = shallow(<EmailVerifyPage {...props} />)
    expect(props.history.push).toHaveBeenCalledTimes(1)
  })

  it('should show success message', () => {
    wrapper.setProps({ status: successAction(EMAIL_VERIFY) })

    expect(wrapper.find(Icon).prop('type')).toBe('check-circle')
    expect(wrapper.find('h1').length).toBe(1)
    expect(wrapper.find('h3').length).toBe(1)
    expect(wrapper.find('h1').html()).toContain('Email is verified now')
  })

  it('should show error message', () => {
    const error = 'error'
    wrapper.setProps({ status: failAction(EMAIL_VERIFY), error })

    expect(wrapper.find(Icon).prop('type')).toBe('exclamation-circle')
    expect(wrapper.find('h1').length).toBe(1)
    expect(wrapper.find('h3').length).toBe(1)
  })
})
