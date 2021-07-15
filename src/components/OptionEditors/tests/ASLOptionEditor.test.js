import React from 'react'
import { mount } from 'enzyme'
import { Input, InputNumber, Radio } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import ASLOptionEditor from '../ASLOptionEditor'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('ASL'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('ASLOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<ASLOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Radio.Group).length).toBe(5)
    expect(wrapper.find(Input).length).toBe(4)
    expect(wrapper.find(InputNumber).length).toBe(5)
  })

  it('should update values', () => {
    wrapper.find(Radio.Group).forEach(radioGroup => radioGroup.props().onChange({ target: true }))

    expect(initialProps.setAnalysisOption).toHaveBeenCalledTimes(5)

    const mockFn = jest.fn()
    wrapper.setProps({ setAnalysisOption: mockFn })

    // Set each of the 4 input new values.
    wrapper.find(Input).forEach(input =>
      input.props().onChange({
        target: { value: 'abc' },
      }),
    )
    wrapper.find(InputNumber).forEach(inputNumber => inputNumber.props().onChange(1))
    expect(mockFn).toHaveBeenCalledTimes(9)
  })

  it('should update TIs value', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ setAnalysisOption: mockFn })

    const fwhmInput = wrapper.find(Input).first()

    // Only array of number is parsed to Array. Other values will be kept the same.
    const value = JSON.stringify(123)
    fwhmInput.props().onChange({ target: { value } })

    expect(mockFn).toHaveBeenCalledWith({ name: 'TIs', option: { value } })

    // Entered array of numbers. Expect the value to be of type Array.
    const arrayValue = [1, 2, 3]
    fwhmInput.props().onChange({ target: { value: JSON.stringify(arrayValue) } })

    expect(mockFn).toHaveBeenCalledWith({ name: 'TIs', option: { value: arrayValue } })
  })
})
