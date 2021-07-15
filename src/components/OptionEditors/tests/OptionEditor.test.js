import React from 'react'
import { mount } from 'enzyme'
import { Input } from 'antd'
import { Select } from 'components'
import OptionEditor from '../OptionEditor'

const initialProps = {
  analysisOptions: {
    name: { value: 'name' },
    description: { value: 'description' },
  },
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('OptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<OptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Input).length).toBe(2)
    expect(wrapper.find(Select).length).toBe(1)
    wrapper.setProps({ readOnly: true })
  })

  it('should change name', () => {
    const input = wrapper.find(Input).first()
    const value = 'value'
    input.props().onChange({ target: { value } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'name', option: { value } })
  })

  it('should change description', () => {
    const input = wrapper.find(Input).last()
    const value = 'value'
    input.props().onChange({ target: { value } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'description', option: { value } })
  })

  it('should change slurm partition', () => {
    const select = wrapper.find(Select)
    const value = 'qTRDBF'
    select.props().onChange(value)
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'slurm_partition', option: { value } })
  })
})
