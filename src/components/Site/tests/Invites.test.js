import React from 'react'
import { shallow, mount } from 'enzyme'
import { Button, Empty, Table } from 'antd'
import { SEND_INVITE_MY_SITE } from 'store/modules/auth'
import { SEND_INVITE } from 'store/modules/sites'
import { SiteInviteForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { SiteMock } from 'test/mocks'
import SiteInvites from '../Invites'

const initialProps = {
  site: SiteMock(),
  myRole: 'Admin',
  status: 'INIT',
  sendInvite: jest.fn(),
  deleteInvite: jest.fn(),
}

describe('SiteInvites', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SiteInvites {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find(SiteInviteForm).length).toBe(1)

    wrapper.setProps({ myRole: 'SuperAdmin' })
  })

  it('should show drawer', () => {
    const beforeShowDrawer = wrapper.state().showDrawer
    const button = wrapper.find(Button)
    button.simulate('click')

    const afterShowDrawer = wrapper.state().showDrawer
    expect(beforeShowDrawer !== afterShowDrawer).toBeTruthy()
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: successAction(SEND_INVITE) })
    wrapper.setProps({ status: successAction(SEND_INVITE_MY_SITE) })
    expect(wrapper.state().showDrawer).toBeFalsy()
  })

  it('should handle form submit', () => {
    const form = wrapper.find(SiteInviteForm)
    const data = { email: 'johndoe@email.com' }
    form.props().onSubmit(data)
    expect(initialProps.sendInvite).toHaveBeenCalledWith({ siteId: initialProps.site.id, data })
  })

  it('should resend invite', () => {
    wrapper = mount(<SiteInvites {...initialProps} />)
    const button = wrapper.find('.resend-btn').first()
    button.simulate('click')

    expect(initialProps.sendInvite).toHaveBeenCalledWith({
      siteId: initialProps.site.id,
      data: { email: initialProps.site.invites[0].email },
    })
  })

  it('should not render buttons', () => {
    wrapper.setProps({ myRole: 'User' })
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should cancel invite', () => {
    wrapper = mount(<SiteInvites {...initialProps} />)
    const button = wrapper.find('.cancel-btn').first()
    button.simulate('click')
  })

  it('shoudl render empty', () => {
    wrapper.setProps({ site: { ...initialProps.site, invites: [] } })
    expect(wrapper.find(Empty).length).toBe(1)
  })
})
