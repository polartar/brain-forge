import React from 'react'
import { shallow } from 'enzyme'
import { Form, Select } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import { FMRI32UploadSection } from './index'

const { Item: FormItem } = Form
const { Option } = Select

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI_32ch'),
  readOnly: false,
  initAnalysisOptions: jest.fn(),
  setAllFiles: jest.fn(),
  selectAnalysisOptions: jest.fn(),
  setCurrentFiles: jest.fn(),
  setAnalysisOption: jest.fn(),
}

describe('FMRI32UploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FMRI32UploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(4)
  })

  it('should display filesSeries as Option in 3 selects', () => {
    // There is 1 empty option initially.
    expect(wrapper.find(Option).length).toBe(1)

    wrapper.setState({ filesSeries: [{ id: 'series_1', label: 'series_1' }] })
    expect(wrapper.find(Option).length).toBe(4)
  })
})
