import React from 'react'
import { mount } from 'enzyme'
import { Button, Input } from 'antd'
import { changeInputValue } from 'test/helpers'
import { TagMock } from 'test/mocks'
import TagForm from '../TagForm'

const initialProps = {
  tag: null,
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('TagForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<TagForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Input).length).toBe(1)
  })

  it('should handle create', () => {
    const formData = { label: 'tag-1' }

    const props = { ...initialProps, tag: TagMock() }
    wrapper = mount(<TagForm {...props} />)

    changeInputValue(wrapper.find(Input).first(), formData.label)

    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith({ id: props.tag.id, data: formData })
  })

  it('should generate form submit error', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ onSubmit: mockFn })

    changeInputValue(wrapper.find(Input).first(), '')
    wrapper.find('form').simulate('submit')

    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
