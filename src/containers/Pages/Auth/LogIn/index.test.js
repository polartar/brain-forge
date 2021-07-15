import React from 'react'
import { shallow } from 'enzyme'
import { Alert, Button } from 'antd'
import { LOGIN, SEND_PASSWORD_RESET_EMAIL } from 'store/modules/auth'
import { LogInForm, PasswordResetForm } from 'components'
import { successAction, failAction } from 'utils/state-helpers'
import { LogInPage } from './index'

const initialProps = {
  status: 'INIT',
  error: null,
  logIn: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  version: 'v1.0.0',
}

describe('LogInPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<LogInPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(LogInForm).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(PasswordResetForm).length).toBe(0)
  })

  it('should show error alert', () => {
    const error = 'error'
    wrapper.setProps({ status: failAction(LOGIN), error })

    expect(wrapper.find(Alert).length).toBe(1)
    expect(wrapper.find(Alert).prop('message')).toBe(error)
  })

  it('should show forgot password form', () => {
    const button = wrapper.find(Button)
    button.simulate('click')

    expect(wrapper.find(PasswordResetForm).length).toBe(1)

    wrapper
      .find(PasswordResetForm)
      .props()
      .onSubmit()
    expect(initialProps.sendPasswordResetEmail).toHaveBeenCalledTimes(1)

    wrapper.setProps({ status: SEND_PASSWORD_RESET_EMAIL })
    expect(wrapper.find(PasswordResetForm).prop('sending')).toBeTruthy()
  })

  it('should change login form props', () => {
    wrapper.setProps({ status: LOGIN })
    expect(wrapper.find(LogInForm).prop('loggingIn')).toBeTruthy()
  })

  it('should change component props', () => {
    wrapper.setProps({ status: SEND_PASSWORD_RESET_EMAIL })
    wrapper.setProps({ status: successAction(SEND_PASSWORD_RESET_EMAIL) })
  })

  it('should submit loggin form data', () => {
    wrapper
      .find(LogInForm)
      .props()
      .onSubmit()
    expect(initialProps.logIn).toHaveBeenCalledTimes(1)
  })
})
