import React from 'react'
import { shallow } from 'enzyme'
import { Form } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import { SPMGLMUploadSection } from './index'

const { Item: FormItem } = Form

const initialProps = {
  allFiles: [],
  analysisOptions: AnalysisOptionsMock('SPMGLM'),
  listAnalysis: jest.fn(),
  readOnly: false,
  initAnalysisOptions: jest.fn(),
  setAnalysisOption: jest.fn(),
  status: 'INIT',
  error: '',
}

describe('SPMGLMUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SPMGLMUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(2)
    expect(initialProps.listAnalysis).toHaveBeenCalled()
  })
})
