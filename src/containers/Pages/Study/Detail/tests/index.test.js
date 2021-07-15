import React from 'react'
import { shallow } from 'enzyme'
import { Tabs, Card } from 'antd'
import { LIST_USER } from 'store/modules/auth'
import { LIST_SITE } from 'store/modules/sites'
import { PreprocessingSummaryTable } from 'containers'
import { Loader } from 'components'
import { UserMock, UsersMock, SitesMock, PreprocessingSummaryMock } from 'test/mocks'
import { StudyDetailPage } from '../index'
import StudyInfo from '../StudyInfo'
import DataProviders from '../DataProviders'
import SharedUsers from '../SharedUsers'

const { TabPane } = Tabs

const initialProps = {
  user: UserMock(),
  users: UsersMock(3),
  sites: SitesMock(3),
  study: PreprocessingSummaryMock(),
  match: {
    params: { studyId: 1 },
  },
  status: 'INIT',
  authStatus: 'INIT',
  listUser: jest.fn(),
  getProfile: jest.fn(),
  listSite: jest.fn(),
  getStudy: jest.fn(),
  updateStudy: jest.fn(),
}

describe('StudyDetailPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StudyDetailPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(5)
    expect(wrapper.find(PreprocessingSummaryTable).length).toBe(1)
    expect(wrapper.find(StudyInfo).length).toBe(1)
    expect(wrapper.find(DataProviders).length).toBe(1)
    expect(wrapper.find(SharedUsers).length).toBe(1)

    expect(initialProps.listSite).toHaveBeenCalledTimes(1)
    expect(initialProps.listUser).toHaveBeenCalledTimes(1)
    expect(initialProps.getStudy).toHaveBeenCalledWith(initialProps.match.params.studyId)
    expect(initialProps.getProfile).toHaveBeenCalledTimes(1)
  })

  it('should render empty content', () => {
    wrapper.setProps({ study: null })
    expect(wrapper.find(Card).length).toBe(0)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: LIST_SITE })
    expect(wrapper.find(Loader).length).toBe(1)

    wrapper.setProps({ status: null, authStatus: LIST_USER })
    expect(wrapper.find(Loader).length).toBe(1)
  })
})
