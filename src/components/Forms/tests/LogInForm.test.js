import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount } from 'enzyme'
import { Button } from 'antd'
import { LANGUAGE } from 'config/base'
import { updateFormValues } from 'test/helpers'
import LogInForm from '../LogInForm'

describe('LogInForm', () => {
  const formData = {
    username: 'johndoe@gmail.com',
    password: 'admin123',
  }

  it('should render component', () => {
    const submitMock = jest.fn()
    const wrapper = mount(
      <Router>
        <LogInForm onSubmit={submitMock} />
      </Router>,
    )

    expect(wrapper.exists('form')).toBeTruthy()
  })

  it('should submit entered data', () => {
    const submitMock = jest.fn()
    const wrapper = mount(
      <Router>
        <LogInForm loggingIn={false} onSubmit={submitMock} />
      </Router>,
    )

    updateFormValues(wrapper, formData)

    wrapper.find('form').simulate('submit')
    expect(submitMock).toHaveBeenCalledWith(formData)
  })

  it('should not submit when validation fails', () => {
    let submittedData

    const props = { loggingIn: false, onSubmit: data => (submittedData = data) }
    const wrapper = mount(
      <Router>
        <LogInForm {...props} />
      </Router>,
    )

    updateFormValues(wrapper, formData, true)

    wrapper.find('form').simulate('submit')
    expect(submittedData).toBeUndefined()

    const formText = wrapper.find('form').text()

    expect(formText).toContain(LANGUAGE.required)
    expect(formText).toContain(LANGUAGE.required)
  })

  it('should show loader in the log in button', () => {
    const props = { loggingIn: true, onSubmit: jest.fn() }
    const wrapper = mount(
      <Router>
        <LogInForm {...props} />
      </Router>,
    )

    const logInButton = wrapper.find(Button).first()
    const registerButton = wrapper.find(Button).last()

    expect(logInButton.prop('loading')).toBeTruthy()
    expect(logInButton.prop('disabled')).toBeTruthy()
    expect(registerButton.prop('disabled')).toBeTruthy()
  })
})
