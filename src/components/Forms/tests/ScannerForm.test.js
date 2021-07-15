import React from 'react'
import { mount } from 'enzyme'
import { Button, Input, InputNumber } from 'antd'
import { SitesMock, ScannerMock } from 'test/mocks'
import { changeInputValue } from 'test/helpers'
import ScannerForm from '../ScannerForm'

const initialProps = {
  isSuper: false,
  scanner: null,
  site: [],
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('ScannerForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<ScannerForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Input).length).toBe(5)
    expect(wrapper.find(InputNumber).length).toBe(1)
  })

  it('should show site dropdown', () => {
    const props = { ...initialProps, scanner: ScannerMock(), isSuper: true, sites: SitesMock() }
    wrapper = mount(<ScannerForm {...props} />)
  })

  it('should handle create', () => {
    const formData = {
      full_name: 'full_name',
      label: 'label',
    }
    changeInputValue(wrapper.find(Input).first(), formData.full_name)
    changeInputValue(wrapper.find(Input).at(1), formData.label)
    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith({ data: formData })
  })

  it('should handle update', () => {
    const scanner = { id: 1, full_name: 'full_name', label: 'label' }
    const props = { ...initialProps, scanner }
    wrapper = mount(<ScannerForm {...props} />)

    const label = 'scanner-1'

    changeInputValue(wrapper.find(Input).at(1), label)
    wrapper.find('form').simulate('submit')

    expect(props.onSubmit).toHaveBeenCalledWith({ id: scanner.id, data: { full_name: scanner.full_name, label } })

    wrapper.find(Button).last().simulate('click')
    expect(props.onCancel).toHaveBeenCalledTimes(1)
  })

  it('should generate form submit error', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ onSubmit: mockFn })

    changeInputValue(wrapper.find(Input).first(), 'full_name')
    wrapper.find('form').simulate('submit')

    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
