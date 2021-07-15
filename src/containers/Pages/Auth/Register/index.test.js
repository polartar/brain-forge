import React from 'react'
import { shallow } from 'enzyme'
import { Alert } from 'antd'
import { REGISTER } from 'store/modules/auth'
import { RegisterForm } from 'components'
import { failAction } from 'utils/state-helpers'
import { RegisterPage } from './index'

const initialProps = {
  status: 'INIT',
  error: null,
  register: jest.fn(),
  version: 'v1.0.0',
}

describe('RegisterPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RegisterPage {...initialProps} />)
  })

  it('should render register form', () => {
    expect(wrapper.find(RegisterForm).length).toBe(1)
  })

  it('should show error alert', () => {
    const error = 'error'
    wrapper.setProps({ status: failAction(REGISTER), error })

    expect(wrapper.find(Alert).length).toBe(1)
    expect(wrapper.find(Alert).prop('message')).toBe(error)
  })

  it('should submit register form data', () => {
    wrapper
      .find(RegisterForm)
      .props()
      .onSubmit()
    expect(initialProps.register).toHaveBeenCalledTimes(1)
  })
})
