import React from 'react'
import { shallow } from 'enzyme'
import { Card } from 'antd'
import { SolutionMock } from 'test/mocks'
import AnalysesSection from './index'

const initialProps = {
  solution: SolutionMock(),
}

describe('AnalysesSection', () => {
  it('should render component', () => {
    const wrapper = shallow(<AnalysesSection {...initialProps} />)
    expect(wrapper.find(Card).length).toBe(initialProps.solution.analysis_types.length)
  })
})
