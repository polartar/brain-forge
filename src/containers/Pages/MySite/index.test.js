import React from 'react'
import { shallow } from 'enzyme'
import { Empty, Button } from 'antd'
import { GET_PROFILE, DELETE_MY_SITE, LEAVE_MYSITE } from 'store/modules/auth'
import { Loader, SiteAddForm, SiteMembers, SiteInvites } from 'components'
import { successAction } from 'utils/state-helpers'
import { UserMock, SiteMock } from 'test/mocks'
import { MySitePage } from './index'

const initialProps = {
  user: UserMock(),
  site: SiteMock(1),
  status: 'INIT',
  getProfile: jest.fn(),
  getMySite: jest.fn(),
  createMySite: jest.fn(),
  leaveMySite: jest.fn(),
  deleteMySite: jest.fn(),
  removeMemberMySite: jest.fn(),
  sendInviteMySite: jest.fn(),
  deleteInviteMySite: jest.fn(),
}

describe('MySitePage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MySitePage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(SiteMembers).length).toBe(1)
    expect(wrapper.find(SiteInvites).length).toBe(1)
  })

  it('should render site admin', () => {
    wrapper.setProps({ user: { ...initialProps.user, is_superuser: true } })
    wrapper.setProps({ user: { ...initialProps.user, is_superuser: false, site_role: 'Admin' } })
    expect(wrapper.find(Button).length).toBe(2)

    const btns = wrapper.find(Button)
    btns.forEach(btn => {
      btn.simulate('click')
    })
  })

  it('should render loader', () => {
    wrapper.setProps({ status: GET_PROFILE })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ site: null })
    expect(wrapper.find(Empty).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(SiteAddForm).length).toBe(1)

    const beforeShowDrawer = wrapper.state().showDrawer
    const btn = wrapper.find(Button)
    btn.simulate('click')
    const afterShowDrawer = wrapper.state().showDrawer
    expect(beforeShowDrawer !== afterShowDrawer).toBeTruthy()

    const form = wrapper.find(SiteAddForm)
    const values = { name: 'Site' }
    form.props().onSubmit(values)
    expect(initialProps.createMySite).toHaveBeenCalledWith(values)
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: successAction(DELETE_MY_SITE) })
    wrapper.setProps({ status: successAction(LEAVE_MYSITE) })
    expect(wrapper.state().showAddDrawer).toBeFalsy()
  })
})
