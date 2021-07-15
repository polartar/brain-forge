import React from 'react'
import { shallow } from 'enzyme'
import { Switch, Input } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import DistortionForm from '../DistortionForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('DistortionForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DistortionForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Switch).length).toBe(1)
  })

  it('should enable distortion and change input', () => {
    const enableDistortion = wrapper.find(Switch)
    enableDistortion.props().onChange(true)

    expect(wrapper.find(Input).length).toBe(1)

    const input = wrapper.find(Input)
    input.simulate('change', { target: { value: '/src/test' } })
    expect(initialProps.setOption).toHaveBeenCalledTimes(1)
  })
})
