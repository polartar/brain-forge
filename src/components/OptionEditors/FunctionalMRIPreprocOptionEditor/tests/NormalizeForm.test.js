import React from 'react'
import { shallow } from 'enzyme'
import { InputNumber } from 'antd'
import { Select } from 'components'
import { AnalysisOptionsMock } from 'test/mocks'
import NormalizeForm from '../NormalizeForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('NormalizeForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<NormalizeForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(10)
    expect(wrapper.find(Select).length).toBe(2)
  })

  it('should trigger form change', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', Math.random())
    })
    expect(initialProps.setOption).toHaveBeenCalledTimes(10)

    const select = wrapper.find(Select)
    select.first().simulate('change', 'mni')
    expect(initialProps.setOption).toHaveBeenCalledTimes(11)
  })
})
