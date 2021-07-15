import React from 'react'
import { shallow } from 'enzyme'
import { get } from 'lodash'
import { AnalysisOptionsMock } from 'test/mocks'
import { ScansOptionEditor } from './ScansOptionEditor'

import DataFileSelect from '../DataFileSelect'

const initialProps = {
  allFiles: [],
  analysisOptions: AnalysisOptionsMock('GroupSPMGLM'),
  readOnly: false,
  handleSetOption: jest.fn(),
}

describe('GroupSPMGLMScansOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ScansOptionEditor {...initialProps} />)
  })

  it('should render components for one-sample t-test', () => {
    expect(get(initialProps, 'analysisOptions.Design_Type.value')).toBe('One Sample T-Test')
    expect(wrapper.find(DataFileSelect).length).toBe(1)
  })

  it('should render components for two-sample t-test', () => {
    expect(wrapper.find(DataFileSelect).length).toBe(1)

    const newAnalysisOptions = {
      ...initialProps.analysisOptions,
      Design_Type: {
        value: 'Two Sample T-Test',
      },
    }

    wrapper.setProps({ analysisOptions: newAnalysisOptions })
    expect(wrapper.find(DataFileSelect).length).toBe(2)
  })
})
