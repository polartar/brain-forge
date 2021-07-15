import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { LIST_PROBLEM_SET } from 'store/modules/analyses'
import { ProblemsMock } from 'test/mocks'
import { AnalysisRunPage } from './index'
import { Loader } from 'components'

const { TabPane } = Tabs

const initialProps = {
  problems: ProblemsMock(),
  status: 'INIT',
  listProblemSet: jest.fn(),
}

describe('AnalysisRunPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisRunPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(initialProps.problems.length)
    expect(initialProps.listProblemSet).toHaveBeenCalledTimes(1)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: LIST_PROBLEM_SET })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render no data', () => {
    wrapper.setProps({ problems: null })
    wrapper.setProps({ problems: [] })
    expect(wrapper.find(Tabs).length).toBe(0)
  })

  it('should change tabs', () => {
    wrapper
      .find(Tabs)
      .props()
      .onChange(initialProps.problems[1].name)

    expect(wrapper.state('activeSolution')).toBe(initialProps.problems[1].solution_sets[0].name)
  })

  it('should set active solution', () => {
    wrapper
      .find('.analysis-solution-link')
      .last()
      .simulate('click')

    expect(wrapper.state('activeSolution')).toBe('SolutionSet Name 2')
  })
})
