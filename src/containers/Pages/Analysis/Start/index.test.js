import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { AnalysisPredictionSection, UploadSection } from 'containers'
import { Loader } from 'components'
import { AnalysisTypeMock, AnalysisMock } from 'test/mocks'
import { AnalysisStartPage } from './index'

const initialProps = {
  analysis: null,
  analysisType: AnalysisTypeMock(1, 1, 'Voxel-based Morphometry'),
  match: {
    params: {
      analysisType: 1,
    },
  },
  location: null,
  getAnalysis: jest.fn(),
  getAnalysisType: jest.fn(),
  setAnalysis: jest.fn(),
  clearAnalysisOptions: jest.fn(),
}

describe('AnalysisStartPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisStartPage {...initialProps} />)
  })

  it('should render component', () => {
    const wrapper = shallow(<AnalysisStartPage {...initialProps} />)

    expect(initialProps.getAnalysisType).toHaveBeenCalledWith(initialProps.match.params.analysisType)
    expect(wrapper.find(UploadSection).length).toBe(1)
    expect(wrapper.find(AnalysisPredictionSection).length).toBe(1)
  })

  it('should unmount component', () => {
    wrapper.setProps({ analysisType: null })
    expect(wrapper.find(Loader).length).toBe(1)

    wrapper.unmount()
    expect(initialProps.clearAnalysisOptions).toHaveBeenCalledTimes(1)
  })

  it('should render component with analysis', () => {
    const props = update(initialProps, {
      location: {
        $set: {
          search: '?analysisId=5',
        },
      },
      analysis: { $set: null },
    })
    const wrapper = shallow(<AnalysisStartPage {...props} />)
    expect(props.getAnalysis).toHaveBeenCalledWith('5')
    expect(wrapper.find(Loader).length).toBe(1)

    wrapper.setProps({ analysis: AnalysisMock() })

    wrapper.unmount()
    expect(props.setAnalysis).toHaveBeenCalledWith(null)
  })
})
