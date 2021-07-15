import React from 'react'
import { shallow } from 'enzyme'
import { Checkbox, InputNumber } from 'antd'
import { Select } from 'components'
import { AnalysisOptionsMock } from 'test/mocks'
import SegmentationForm from '../SegmentationForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('VBM'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('SegmentationForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SegmentationForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(9)
    expect(wrapper.find(Checkbox).length).toBe(1)
    expect(wrapper.find(Select).length).toBe(2)
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

    const selects = wrapper.find(Select)
    selects.forEach(select => {
      select.simulate('change', true)
    })
  })
})
