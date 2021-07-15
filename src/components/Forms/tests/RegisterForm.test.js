import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { Button } from 'antd'
import { changeInputValue, updateFormValues } from 'test/helpers'
import RegisterForm from '../RegisterForm'

describe('RegisterForm', () => {
  const formData = {
    first_name: 'you',
    last_name: 'xin',
    username: 'xinyou',
    email: 'xinyou@gmail.com',
    password: 'password',
    confirm: 'password',
  }

  it('should render component', () => {
    const submitMock = jest.fn()
    const wrapper = mount(
      <Router>
        <RegisterForm onSubmit={submitMock} />
      </Router>,
    )

    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('should submit entered data', () => {
    const submitMock = jest.fn()
    const wrapper = mount(
      <Router>
        <RegisterForm onSubmit={submitMock} />
      </Router>,
    )

    updateFormValues(wrapper, formData)

    wrapper.find('form').simulate('submit')
    expect(submitMock).toHaveBeenCalledWith(formData)
  })

  it('should show loader in register button', () => {
    const props = { registering: true, onSubmit: jest.fn() }
    const wrapper = mount(
      <Router>
        <RegisterForm {...props} />
      </Router>,
    )

    const logInButton = wrapper.find(Button).first()
    const registerButton = wrapper.find(Button).last()

    expect(logInButton.prop('loading')).toBeTruthy()
    expect(logInButton.prop('disabled')).toBeTruthy()
    expect(registerButton.prop('disabled')).toBeTruthy()
  })

  it('should set dirty', () => {
    const props = { registering: false, onSubmit: jest.fn() }
    const wrapper = mount(
      <Router>
        <RegisterForm {...props} />
      </Router>,
    )
    const confirm = wrapper.find('input[id="confirm"]')
    changeInputValue(confirm, 'password')
    confirm.simulate('blur')

    const formData = {
      first_name: 'you',
      last_name: 'xin',
      username: 'xinyou',
      email: 'xinyou@gmail.com',
      password: 'password',
      confirm: 'confirm',
    }
    updateFormValues(wrapper, formData)
    wrapper.find('form').simulate('submit')
    expect(props.onSubmit).toHaveBeenCalledTimes(0)
  })
})
