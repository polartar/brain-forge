import React from 'react'
import { mount } from 'enzyme'
import { Empty, Table } from 'antd'
import { MyInvite } from '../Invite'

const initialProps = {
  invites: [
    { id: 1, site: { name: 'Site 1' }, send_date: '2019-06-30' },
    { id: 2, site: { name: 'Site 2' }, send_date: '2019-06-30' },
  ],
  status: 'INIT',
  listMyInvite: jest.fn(),
  acceptMyInvite: jest.fn(),
  rejectMyInvite: jest.fn(),
}

describe('MyInvite', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<MyInvite {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
    expect(initialProps.listMyInvite).toHaveBeenCalled()
  })

  it('should render empty', () => {
    wrapper.setProps({ invites: [] })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should accept invite', () => {
    const button = wrapper.find('.accept-btn').first()
    button.simulate('click')
  })

  it('should reject invite', () => {
    const button = wrapper.find('.delete-btn').first()
    button.simulate('click')
  })
})
