import React from 'react'
import { mount } from 'enzyme'
import { Button, Select } from 'antd'
import { UsersMock } from 'test/mocks'
import UserSelectForm from '../UserSelectForm'

const initialProps = {
  submitting: false,
  users: UsersMock(5),
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('UserSelectForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<UserSelectForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Select).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should show form error', () => {
    wrapper.find('form').simulate('submit')
    expect(initialProps.onSubmit).toHaveBeenCalledTimes(0)
  })

  it('should handle form submit', () => {
    wrapper
      .find(Select)
      .props()
      .onChange(1)
    wrapper.find('form').simulate('submit')
    expect(initialProps.onSubmit).toHaveBeenCalledTimes(1)
  })
})
