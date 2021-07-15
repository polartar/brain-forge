import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Form, Input, Radio } from 'antd'
import { AnalysisOptionsMock, FileMock } from 'test/mocks'
import RegressionOptionEditor from '../RegressionOptionEditor'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

const initialProps = {
  analysisOptions: AnalysisOptionsMock('Regression'),
  file: FileMock(),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('RegressionOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RegressionOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(2)

    const props = update(initialProps, { analysisOptions: { formula: { value: { $set: 'custom' } } } })
    wrapper.setProps(props)

    const input = wrapper.find(Input)
    input.simulate('change', { target: { value: '12' } })

    const radioGroup = wrapper.find(RadioGroup)
    radioGroup.simulate('change', { target: { value: '123' } })
  })
})
