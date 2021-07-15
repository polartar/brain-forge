import React from 'react'
import { shallow } from 'enzyme'
import { Form, InputNumber, Checkbox } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import PolyssifierOptionEditor from '../PolyssifierOptionEditor'

const { Item: FormItem } = Form

const initialProps = {
  analysisOptions: AnalysisOptionsMock('Polyssifier'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('PolyssifierOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PolyssifierOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(2)
  })

  it('should update options', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', { target: { value: 'value' } })
    })

    const checkboxes = wrapper.find(Checkbox)
    checkboxes.forEach(checkbox => {
      checkbox.simulate('change', { target: { value: 'value' } })
    })

    const checkbox = wrapper.find(Checkbox).first()
    checkbox.simulate('change', { target: { value: initialProps.analysisOptions.include.value[0] } })
  })
})
