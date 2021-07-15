import React from 'react'
import { shallow } from 'enzyme'
import { successAction } from 'utils/state-helpers'
import { LIST_ANALYSIS } from 'store/modules/analyses'

import { AnalysisOptionsMock, AnalysesMock } from 'test/mocks'
import { GroupSPMGLMUploadSection } from './index'

import SPMMetadataEditor from './SPMMetadataEditor'

const initialProps = {
  allFiles: [],
  analysisOptions: AnalysisOptionsMock('GroupSPMGLM'),
  listAnalysis: jest.fn(),
  analyses: {
    totalCount: 2,
    results: AnalysesMock(),
  },
  readOnly: false,
  initAnalysisOptions: jest.fn(),
  setAnalysisOption: jest.fn(),
  analysesStatus: successAction(LIST_ANALYSIS),
}

describe('GroupSPMGLMUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<GroupSPMGLMUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(SPMMetadataEditor).length).toBe(1)
  })
})
