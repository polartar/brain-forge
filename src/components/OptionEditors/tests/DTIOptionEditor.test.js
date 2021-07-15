import React from 'react'
import { shallow } from 'enzyme'
import { Input, InputNumber, Radio } from 'antd'
import { MiscFileTree, Select } from 'components'
import { AnalysisOptionsMock } from 'test/mocks'
import DTIOptionEditor from '../DTIOptionEditor'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('DTI'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('DTIOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DTIOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Radio.Group).length).toBe(3)
    expect(wrapper.find(Input).length).toBe(3)
    expect(wrapper.find(InputNumber).length).toBe(6)
    expect(wrapper.find(Select).length).toBe(1)
    expect(wrapper.find(MiscFileTree).length).toBe(1)
  })

  it('should update values', () => {
    wrapper.find(Radio.Group).forEach(radioGroup => radioGroup.props().onChange({ target: true }))

    expect(initialProps.setAnalysisOption).toHaveBeenCalledTimes(3)

    const mockFn = jest.fn()
    wrapper.setProps({ setAnalysisOption: mockFn })

    wrapper.find(InputNumber).forEach(input =>
      input.props().onChange({
        target: { value: 1.23 },
      }),
    )

    wrapper.find(Input).forEach(input =>
      input.props().onChange({
        target: { value: 'test' },
      }),
    )

    expect(mockFn).toHaveBeenCalledTimes(9)
  })
})
