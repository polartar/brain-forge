import React from 'react'
import { mount } from 'enzyme'
import { Button, Input } from 'antd'
import { changeInputValue } from 'test/helpers'
import InviteForm from '../InviteForm'

const initialProps = {
  submitting: false,
  onSubmit: jest.fn(),
}

describe('InviteForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<InviteForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Input).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should handle form submit', () => {
    changeInputValue(wrapper.find(Input), 'johndoe@email.com')
    wrapper.find('form').simulate('submit')
  })

  it('should show form error', () => {
    wrapper.find('form').simulate('submit')
  })
})
