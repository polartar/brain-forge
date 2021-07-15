import React from 'react'
import { shallow } from 'enzyme'
import update from 'immutability-helper'
import { GET_SOLUTION_SET } from 'store/modules/analyses'
import { AnalysesSection } from 'containers'
import { Loader } from 'components'
import { successAction } from 'utils/state-helpers'
import { SolutionMock } from 'test/mocks'
import { SolutionPage } from './index'

const initialProps = {
  match: {
    params: { solutionId: 1 },
  },
  solution: SolutionMock(),
  status: successAction(GET_SOLUTION_SET),
  getSolutionSet: jest.fn(),
  initializeCurrentFiles: jest.fn(),
}

describe('SolutionPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SolutionPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(AnalysesSection).length).toBe(1)
    expect(initialProps.getSolutionSet).toHaveBeenCalledWith(initialProps.match.params.solutionId)
    expect(initialProps.initializeCurrentFiles).toHaveBeenCalled()
  })

  it('should render loader', () => {
    wrapper.setProps({ status: GET_SOLUTION_SET })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should show no data', () => {
    wrapper.setProps({ solution: null })
    expect(wrapper.html()).toContain('No Data')

    const props = update(initialProps, {
      solution: { analysis_types: { $set: [] } },
    })
    wrapper.setProps(props)
  })
})
