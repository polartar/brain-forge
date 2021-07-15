import React from 'react'
import { mount } from 'enzyme'
import { Button, Input } from 'antd'
import { changeInputValue } from 'test/helpers'
import SessionForm from '../SessionForm'

const initialProps = {
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('SessionForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SessionForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Input).length).toBe(2)
  })

  it('should handle create', () => {
    const formData = {
      segment_interval: 'segment_interval',
      anonymized_scan_date: 'anonymized_scan_date',
    }

    changeInputValue(wrapper.find(Input).first(), formData.segment_interval)
    changeInputValue(wrapper.find(Input).at(1), formData.anonymized_scan_date)

    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith({ data: formData })
  })

  it('should generate form submit error', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ onSubmit: mockFn })

    changeInputValue(wrapper.find(Input).last(), 'anonymized_scan_date')
    wrapper.find('form').simulate('submit')

    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
