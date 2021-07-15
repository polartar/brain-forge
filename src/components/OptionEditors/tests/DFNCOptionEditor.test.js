import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Form, InputNumber, Checkbox, Radio } from 'antd'
import { changeInputValue } from 'test/helpers'
import { AnalysisOptionsMock } from 'test/mocks'
import DFNCOptionEditor from '../DFNCOptionEditor'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

const initialProps = {
  analysisOptions: AnalysisOptionsMock('dFNC'),
  analyses: {
    results: [
      { id: 1, name: 'Analysis1', analysis_type: 3 },
      { id: 2, name: 'Analysis2', analysis_type: 2 },
      { id: 3, name: 'Analysis3', analysis_type: 1 },
    ],
  },
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('DFNCOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DFNCOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(9)
  })

  it('should change form values', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      changeInputValue(input, 1)
    })

    const checkbox = wrapper.find(Checkbox)
    checkbox.simulate('change', { target: { checked: true } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'tc_despike',
      option: { value: 'yes' },
    })

    checkbox.simulate('change', { target: { checked: false } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'tc_despike',
      option: { value: 'no' },
    })

    const radioGroup = wrapper.find(RadioGroup)
    radioGroup.simulate('change', { target: { value: 'value' } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'dmethod',
      option: { value: 'value' },
    })

    const props = update(initialProps, { analysisOptions: { ica_parent: { value: { $set: null } } } })
    wrapper.setProps(props)
  })
})
