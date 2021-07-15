import React from 'react'
import { mount } from 'enzyme'
import { Checkbox, InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import MancovaOptionEditor from '../MancovaOptionEditor'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('MANCOVA'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('MancovaOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<MancovaOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Checkbox).length).toBe(3)
    expect(wrapper.find(InputNumber).length).toBe(2)
  })

  it('should change input values', () => {
    wrapper
      .find(InputNumber)
      .first()
      .props()
      .onChange('value1')

    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'TR', option: { value: 'value1' } })

    wrapper
      .find(InputNumber)
      .last()
      .props()
      .onChange('value2')

    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'p_threshold', option: { value: 'value2' } })
  })

  it('should change checkbox', () => {
    wrapper
      .find(Checkbox)
      .first()
      .props()
      .onChange({ target: { value: 'value1' } })

    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'features',
      option: { value: [...initialProps.analysisOptions.features.value, 'value1'] },
    })
  })
})
