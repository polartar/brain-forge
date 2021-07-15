import React from 'react'
import { shallow } from 'enzyme'
import { Card, Tabs } from 'antd'
import { GET_SITE } from 'store/modules/sites'
import { Loader } from 'components'
import { SiteMock } from 'test/mocks'
import { SiteDetailPage } from './index'

const { TabPane } = Tabs

const initialProps = {
  site: SiteMock(1),
  match: {
    params: { siteId: 1 },
  },
  status: 'INIT',
  getSite: jest.fn(),
  createSite: jest.fn(),
  sendInvite: jest.fn(),
  deleteInvite: jest.fn(),
  setAdmin: jest.fn(),
  removeMember: jest.fn(),
}

describe('SiteDetailPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SiteDetailPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(3)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: GET_SITE })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ site: null })
    expect(wrapper.find(Loader).length).toBe(0)
    expect(wrapper.find(Card).length).toBe(0)
  })
})
