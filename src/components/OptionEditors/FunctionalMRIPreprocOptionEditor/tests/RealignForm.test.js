import React from 'react'
import { shallow } from 'enzyme'
import { Checkbox, InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import RealignForm from '../RealignForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('RealignForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RealignForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(13)
    expect(wrapper.find(Checkbox).length).toBe(2)
  })

  it('should trigger form change', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', Math.random())
    })

    const checkboxes = wrapper.find(Checkbox)
    checkboxes.forEach(checkbox => {
      checkbox.simulate('change', true)
    })
  })
})
