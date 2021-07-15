import React from 'react'
import { shallow } from 'enzyme'
import { Collapse, InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import FMRIPhantomQAOptionEditor from '../FMRIPhantomQAOptionEditor'

const { Panel } = Collapse

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI_PhantomQA'),
  readOnly: false,
  setAnalysisOption: jest.fn(),
}

describe('FMRIPhantomQAOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FMRIPhantomQAOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(21)
    expect(wrapper.find(Panel).length).toBe(5)
  })

  it('should trigger form change', () => {
    const inputs = wrapper.find(InputNumber)
    inputs.forEach(input => {
      input.simulate('change', Math.random())
    })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledTimes(21)
  })
})
