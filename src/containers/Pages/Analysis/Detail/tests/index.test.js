import React from 'react'
import { shallow } from 'enzyme'
import { Card } from 'antd'
import { LIST_USER } from 'store/modules/auth'
import { GET_ANALYSIS } from 'store/modules/analyses'
import { Loader } from 'components'
import { AnalysisMock, AllAnalysisTypesMock, UsersMock, UserMock } from 'test/mocks'
import { AnalysisDetailPage } from '../index'
import AnalysisInfo from '../AnalysisInfo'
import SharedUsers from '../SharedUsers'

const initialProps = {
  analysis: AnalysisMock(),
  analysisTypes: AllAnalysisTypesMock(),
  users: UsersMock(),
  user: UserMock(),
  match: { params: { analysisId: 1 } },
  status: 'INIT',
  authStatus: 'INIT',
  getAnalysis: jest.fn(),
  updateAnalysis: jest.fn(),
  listUser: jest.fn(),
}

describe('AnalysisDetailPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisDetailPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.getAnalysis).toHaveBeenCalledWith(initialProps.match.params.analysisId)
    expect(initialProps.listUser).toHaveBeenCalledTimes(1)

    expect(wrapper.find(AnalysisInfo).length).toBe(1)
    expect(wrapper.find(SharedUsers).length).toBe(1)
  })

  it('should show loader', () => {
    wrapper.setProps({ status: GET_ANALYSIS })
    wrapper.setProps({ status: 'INIT', authStatus: LIST_USER })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should not render analysis', () => {
    wrapper.setProps({ analysis: null })
    expect(wrapper.find(Card).length).toBe(0)
  })
})
