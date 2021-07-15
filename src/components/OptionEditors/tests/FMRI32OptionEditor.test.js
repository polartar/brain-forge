import React from 'react'
import { mount } from 'enzyme'
import { Input, InputNumber, Radio } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import FMRI32OptionEditor from '../FMRI32OptionEditor'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI_32ch'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('FMRI32OptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<FMRI32OptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Radio.Group).length).toBe(3)
    expect(wrapper.find(Input).length).toBe(6)
    expect(wrapper.find(InputNumber).length).toBe(1)
  })

  it('should update values', () => {
    wrapper.find(Radio.Group).forEach(radioGroup => radioGroup.props().onChange({ target: true }))

    expect(initialProps.setAnalysisOption).toHaveBeenCalledTimes(3)

    const mockFn = jest.fn()
    wrapper.setProps({ setAnalysisOption: mockFn })
    wrapper.find(Input).forEach(input =>
      input.props().onChange({
        target: { value: [1, 2, 3] },
      }),
    )
    wrapper
      .find(InputNumber)
      .props()
      .onChange(10)

    expect(mockFn).toHaveBeenCalledTimes(7)
  })

  it('should update FWHM value', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ setAnalysisOption: mockFn })

    const fwhmInput = wrapper.find(Input).first()
    const value = JSON.stringify('fwhm')
    fwhmInput.props().onChange({ target: { value } })

    expect(mockFn).toHaveBeenCalledWith({ name: 'FWHM_fmri', option: { value } })

    const arrayValue = [1, 2, 3]
    fwhmInput.props().onChange({ target: { value: JSON.stringify(arrayValue) } })

    expect(mockFn).toHaveBeenCalledWith({ name: 'FWHM_fmri', option: { value: arrayValue } })
  })
})
