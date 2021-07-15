import React from 'react'
import { shallow } from 'enzyme'
import { Form } from 'antd'
import { Select, Option } from 'components'
import { AnalysesMock, AnalysisOptionsMock } from 'test/mocks'
import { DFNCUploadSection } from './index'

const { Item: FormItem } = Form

const initialProps = {
  analysisOptions: AnalysisOptionsMock('dFNC'),
  initAnalysisOptions: jest.fn(),
  setAnalysisOption: jest.fn(),
  analyses: {
    results: AnalysesMock(),
  },
  listAnalysis: jest.fn(),
}

describe('DFNCUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DFNCUploadSection {...initialProps} />)
  })

  it('should render component and call listAnalysis', () => {
    expect(initialProps.listAnalysis).toHaveBeenCalledTimes(1)
    expect(wrapper.find(FormItem).length).toBe(1)
  })

  it('should select order by id', () => {
    const option = wrapper.find(Option)
    expect(option.length).toBe(3)
    expect(option.at(1).props().value).toEqual(2)
  })

  it('should change form values', () => {
    const select = wrapper.find(Select)
    select.simulate('change', 1)
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'ica_parent',
      option: { value: 1 },
    })
  })
})
