import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Form, Radio, InputNumber } from 'antd'
import { Select } from 'components'
import { AnalysisOptionsMock, FilesMock } from 'test/mocks'
import GroupICAOptionEditor from '../GroupICAOptionEditor'
import DataFileTree from 'components/DataFileTree'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

const initialProps = {
  analysisOptions: AnalysisOptionsMock('GICA'),
  analyses: {
    results: [
      { id: 1, name: 'Analysis1', analysis_type: 3 },
      { id: 2, name: 'Analysis2', analysis_type: 2 },
      { id: 3, name: 'Analysis3', analysis_type: 1 },
    ],
  },
  allFiles: FilesMock(3),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('GroupICAOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<GroupICAOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(13)

    const radioGroups = wrapper.find(RadioGroup)
    radioGroups.forEach(radio => {
      radio.simulate('change', { target: { value: 'value' } })
    })

    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', { target: { value: 'value' } })
    })

    const props = update(initialProps, { analysisOptions: { algorithm: { value: { $set: 'GIG-ICA' } } } })
    wrapper.setProps(props)
    const selects = wrapper.find(Select)
    selects.forEach(select => {
      select.simulate('change', { target: { value: 'value' } })
    })
  })

  it('should trigger data file tree change', () => {
    const props = update(initialProps, { analysisOptions: { mask: { value: { $set: 'custom' } } } })
    wrapper.setProps(props)

    const files = ['file1']

    wrapper
      .find(DataFileTree)
      .props()
      .onChange(files)

    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'mask',
      option: {
        file: files,
      },
    })
  })
})
