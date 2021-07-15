import React from 'react'
import { shallow } from 'enzyme'
import { Checkbox, InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import SmoothingForm from '../SmoothingForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('VBM'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('SmoothingForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SmoothingForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(3)
    expect(wrapper.find(Checkbox).length).toBe(1)
  })

  it('should trigger form change', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', Math.random())
    })

    const checkbox = wrapper.find(Checkbox)
    checkbox.simulate('change', true)
  })
})
