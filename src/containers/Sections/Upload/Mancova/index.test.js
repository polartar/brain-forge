import React from 'react'
import { shallow } from 'enzyme'
import { Form, Select } from 'antd'
import { AnalysisMock, AnalysesMock, AnalysisTypeMock, AnalysisOptionsMock, StudiesMock } from 'test/mocks'
import { MancovaUploadSection } from './index'

const { Item: FormItem } = Form
const { Option } = Select

const initialProps = {
  analysis: null,
  analysisOptions: AnalysisOptionsMock('MANCOVA'),
  analyses: {
    results: AnalysesMock(),
  },
  studies: StudiesMock(3),
  status: 'INIT',
  sitesStatus: 'INIT',
  analysisType: AnalysisTypeMock(),
  showSelector: false,
  listUploadableStudy: jest.fn(),
  setAllFiles: jest.fn(),
  setCurrentFiles: jest.fn(),
  updateCurrentFileFields: jest.fn(),
  initializeCurrentFiles: jest.fn(),
  initAnalysisOptions: jest.fn(),
  setAnalysisOption: jest.fn(),
  listAnalysis: jest.fn(),
}

describe('MancovaUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MancovaUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    wrapper.setProps({ analysis: AnalysisMock() })
    expect(wrapper.find(FormItem).length).toBe(2)
  })

  it('should select order by id', () => {
    const option = wrapper.find(Option)
    expect(option.length).toBe(3)
    expect(option.at(1).props().value).toEqual(2)
  })
})
