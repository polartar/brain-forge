import React from 'react'
import { mount } from 'enzyme'
import { Input, InputNumber, Radio } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import WMHOptionEditor from '../WMHOptionEditor'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('WMH'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('WMHOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<WMHOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Radio.Group).length).toBe(3)
    expect(wrapper.find(Input).length).toBe(3)
    expect(wrapper.find(InputNumber).length).toBe(8)
  })

  it('should update values', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ setAnalysisOption: mockFn })
    wrapper.find(Input).forEach(input =>
      input.props().onChange({
        target: { value: 'abc' },
      }),
    )
    expect(mockFn).toHaveBeenCalledTimes(3)

    wrapper.find(InputNumber).forEach(inputNumber => inputNumber.props().onChange(1))
    expect(mockFn).toHaveBeenCalledTimes(3 + 8)
  })
})
