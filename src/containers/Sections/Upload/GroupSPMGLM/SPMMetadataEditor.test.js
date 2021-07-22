import React from 'react'
import { shallow } from 'enzyme'
import { AnalysisOptionsMock, StudiesMock } from 'test/mocks'

import { MetadataEditor } from 'components'
import { SPMMetadataEditor } from './SPMMetadataEditor'

const initialProps = {
  metadataFiles: {},
  metadata: {
    result: [{ id: 1, subject: 'acb' }],
  },
  analysisOptions: AnalysisOptionsMock('GroupSPMGLM'),
  readOnly: false,
  studies: StudiesMock(3),
  listMetadata: jest.fn(),
  getMetadata: jest.fn(),
  setAnalysisOption: jest.fn(),
  initAnalysisOptions: jest.fn(),
  listAnalysis: jest.fn(),
}

describe('SPMMetadataEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SPMMetadataEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(MetadataEditor).length).toBe(1)
  })
})