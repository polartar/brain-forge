import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { Button } from 'antd'
import { LANGUAGE } from 'config/base'
import { changeInputValue } from 'test/helpers'
import PasswordResetForm from '../PasswordResetForm'

describe('PasswordResetForm', () => {
  it('should render component', () => {
    const submitMock = jest.fn()
    const wrapper = mount(
      <Router>
        <PasswordResetForm onSubmit={submitMock} />
      </Router>,
    )

    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('should submit entered data', () => {
    const submitMock = jest.fn()
    const wrapper = mount(
      <Router>
        <PasswordResetForm onSubmit={submitMock} />
      </Router>,
    )

    const email = 'admin@admin.com'
    changeInputValue(wrapper.find('input[type="text"]'), email)

    wrapper.find('form').simulate('submit')
    expect(submitMock).toHaveBeenCalledWith({ email })
  })

  it('should not submit when validation fails', () => {
    let submittedData

    const wrapper = mount(
      <Router>
        <PasswordResetForm onSubmit={data => (submittedData = data)} />
      </Router>,
    )

    changeInputValue(wrapper.find('input[type="text"]'), '')
    wrapper.find('form').simulate('submit')
    expect(submittedData).toBeUndefined()
    expect(wrapper.find('form').text()).toContain(LANGUAGE.required)

    changeInputValue(wrapper.find('input[type="text"]'), 'admin')
    wrapper.find('form').simulate('submit')
    expect(submittedData).toBeUndefined()
    expect(wrapper.find('form').text()).toContain(LANGUAGE.email.invalid)
  })

  it('should show loader in log in button', () => {
    const props = { sending: true, onSubmit: jest.fn() }
    const wrapper = mount(
      <Router>
        <PasswordResetForm {...props} />
      </Router>,
    )

    const logInButton = wrapper.find(Button).first()

    expect(logInButton.prop('loading')).toBeTruthy()
    expect(logInButton.prop('disabled')).toBeTruthy()
  })
})
