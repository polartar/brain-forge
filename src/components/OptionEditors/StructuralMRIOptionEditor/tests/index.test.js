import React from 'react'
import { shallow } from 'enzyme'
import { AnalysisOptionsMock } from 'test/mocks'
import StructuralMRIOptionEditor from '../index'
import SmoothingForm from '../SmoothingForm'
import ReorientForm from '../ReorientForm'
import SegmentationForm from '../SegmentationForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('VBM'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('StructuralMRIOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StructuralMRIOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(SmoothingForm).length).toBe(1)
    expect(wrapper.find(ReorientForm).length).toBe(1)
    expect(wrapper.find(SegmentationForm).length).toBe(1)

    const Form = wrapper.find(SmoothingForm)
    Form.props().setOption('parameter', 'value', 1)
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'parameter', option: { value: 1 } })
  })
})
