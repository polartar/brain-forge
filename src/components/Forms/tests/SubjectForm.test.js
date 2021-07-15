import React from 'react'
import { mount } from 'enzyme'
import { Button, Input } from 'antd'
import { changeInputValue } from 'test/helpers'
import SubjectForm from '../SubjectForm'

const initialProps = {
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('SubjectForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SubjectForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Input).length).toBe(1)
  })

  it('should handle create', () => {
    const formData = {
      anon_id: 'anon_id',
    }

    changeInputValue(wrapper.find(Input).first(), formData.anon_id)

    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith({ data: formData })
  })

  it('should generate form submit error', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ onSubmit: mockFn })

    wrapper.find('form').simulate('submit')

    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
