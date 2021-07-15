import React from 'react'
import { shallow } from 'enzyme'
import { AnalysisOptionsMock } from 'test/mocks'
import FunctionalMRIPreprocOptionEditor from '../index'
import NormalizeForm from '../NormalizeForm'
import SmoothingForm from '../SmoothingForm'
import ReorientForm from '../ReorientForm'
import RealignForm from '../RealignForm'
import SliceTimingCorrectionForm from '../SliceTimingCorrectionForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: true,
  setAnalysisOption: jest.fn(),
}

describe('FunctionalMRIPreprocOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FunctionalMRIPreprocOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(NormalizeForm).length).toBe(1)
    expect(wrapper.find(SliceTimingCorrectionForm).length).toBe(1)
    expect(wrapper.find(SmoothingForm).length).toBe(1)
    expect(wrapper.find(ReorientForm).length).toBe(1)
    expect(wrapper.find(RealignForm).length).toBe(1)
  })
})
