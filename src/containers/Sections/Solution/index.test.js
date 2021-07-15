import React from 'react'
import { shallow } from 'enzyme'
import { Card } from 'antd'
import { ProblemMock } from 'test/mocks'
import SolutionSection from './index'

const initialProps = {
  problem: ProblemMock(),
}

describe('SolutionSection', () => {
  it('should render component', () => {
    const wrapper = shallow(<SolutionSection {...initialProps} />)

    expect(wrapper.find(Card).length).toBe(initialProps.problem.solution_sets.length)
  })
})
