import React from 'react'
import { mount } from 'enzyme'
import { Alert } from 'antd'
import { getInputValue, updateFormValues } from 'test/helpers'
import { UserMock } from 'test/mocks'
import ProfileForm from '../ProfileForm'

const initialProps = {
  loading: false,
  user: UserMock(),
  error: null,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('ProfileForm', () => {
  let wrapper = mount(<ProfileForm {...initialProps} />)

  it('should render component', () => {
    expect(wrapper.exists('form')).toBeTruthy()

    const { email, first_name, last_name, username } = initialProps.user

    expect(getInputValue(wrapper.find('input[id="email"]'))).toBe(email)
    expect(getInputValue(wrapper.find('input[id="first_name"]'))).toBe(first_name)
    expect(getInputValue(wrapper.find('input[id="last_name"]'))).toBe(last_name)
    expect(getInputValue(wrapper.find('input[id="username"]'))).toBe(username)

    expect(wrapper.state().canUpdateProfile).toBeFalsy()
  })

  it('should submit form values', () => {
    let formData = {
      first_name: 'john',
      last_name: 'doe',
      password: 'password',
      confirm: 'password',
    }

    updateFormValues(wrapper, formData)
    wrapper.find('form').simulate('submit')
    expect(initialProps.onSubmit).toHaveBeenCalledTimes(1)
  })

  it('should generate form error', () => {
    const mockFn = jest.fn()
    const formData = {
      email: 'janedoe@gmail.com',
      username: 'janedoe',
      first_name: 'jane',
      password: 'password',
      confirm: 'confirm',
    }
    updateFormValues(wrapper, formData)
    wrapper.setProps({ onSubmit: mockFn })
    wrapper.find('form').simulate('submit')
    expect(mockFn).toHaveBeenCalledTimes(0)

    wrapper.setProps({ error: 'error' })
    expect(wrapper.find(Alert).length).toBe(1)
  })
})
