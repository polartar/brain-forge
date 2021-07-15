import React from 'react'
import { shallow } from 'enzyme'
import { Checkbox, InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import ReorientForm from '../ReorientForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('ReorientForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ReorientForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(6)
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
