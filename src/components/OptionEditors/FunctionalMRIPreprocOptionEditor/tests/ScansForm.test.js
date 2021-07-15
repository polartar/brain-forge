import React from 'react'
import { shallow } from 'enzyme'
import { InputNumber } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import ScansForm from '../ScansForm'

const initialProps = {
  analysisOptions: AnalysisOptionsMock('fMRI'),
  readOnly: false,
  setOption: jest.fn(),
}

describe('ScansForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ScansForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(1)
  })
})
