import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'antd'

import SetPasswordForm from '../SetPasswordForm'

describe('SetPasswordForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SetPasswordForm />)
  })

  it('should render component', () => {
    expect(wrapper.find('input[name="password"]').exists()).toBe(true)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should submit set password', () => {
    const password = wrapper.find('input[name="password"]')
    password.simulate('change', { target: { value: 'acbxyz12' } })

    wrapper.find('button[name="submit"]').simulate('click')
  })
})
