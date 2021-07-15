import React from 'react'
import update from 'immutability-helper'
import { shallow, mount } from 'enzyme'
import { Button, Empty, Table } from 'antd'
import { SiteMock, StudiesMock } from 'test/mocks'
import SiteMembers from '../Members'

const initialProps = {
  site: SiteMock(),
  myRole: 'Admin',
  removeMember: jest.fn(),
}

describe('SiteMembers', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SiteMembers {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ site: { ...initialProps.site, members: [], myRole: 'SuperAdmin' } })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should remove member', () => {
    const props = update(initialProps, {
      site: { members: { 0: { site_role: { $set: 'Admin' }, studies: { $set: StudiesMock(3) } } } },
    })
    wrapper = mount(<SiteMembers {...props} />)
    const button = wrapper.find('.remove-btn').first()
    button.simulate('click')
  })

  it('should not render buttons', () => {
    wrapper.setProps({ myRole: 'User' })
    expect(wrapper.find(Button).length).toBe(0)
  })
})
