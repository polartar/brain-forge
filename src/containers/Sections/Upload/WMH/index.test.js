import React from 'react'
import { shallow } from 'enzyme'
import { Form } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import { WMHUploadSection } from './index'

const { Item: FormItem } = Form

const initialProps = {
  analysisOptions: AnalysisOptionsMock('WMH'),
  readOnly: false,
  initAnalysisOptions: jest.fn(),
  setAllFiles: jest.fn(),
  selectAnalysisOptions: jest.fn(),
  setCurrentFiles: jest.fn(),
  setAnalysisOption: jest.fn(),
}

describe('WMHUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<WMHUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(4)
  })
})
