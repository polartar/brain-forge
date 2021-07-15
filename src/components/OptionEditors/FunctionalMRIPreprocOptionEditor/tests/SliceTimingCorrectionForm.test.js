import React from 'react'
import { shallow } from 'enzyme'
import { Input, InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import SliceTimingCorrectionForm from '../SliceTimingCorrectionForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('SliceTimingCorrectionForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SliceTimingCorrectionForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(1)
    expect(wrapper.find(Input).length).toBe(1)
  })

  it('should trigger form change', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', Math.random())
    })
    expect(initialProps.setOption).toHaveBeenCalledTimes(1)
  })
})
