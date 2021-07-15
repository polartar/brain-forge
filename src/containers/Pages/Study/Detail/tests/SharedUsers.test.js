import React from 'react'
import { mount } from 'enzyme'
import { Empty, Table, Button } from 'antd'
import { UPDATE_STUDY } from 'store/modules/sites'
import { successAction } from 'utils/state-helpers'
import { UsersMock } from 'test/mocks'
import SharedUsers from '../SharedUsers'

const initialProps = {
  study: {
    id: 1,
    name: 'Study 1',
    data_providers: [],
    shared_users: [
      { id: 1, username: 'User 1', email: 'email1@email.com' },
      { id: 2, username: 'User 2', email: 'email2@email.com' },
    ],
  },
  users: UsersMock(3),
  editable: true,
  status: 'INIT',
  updateStudy: jest.fn(),
}

describe('SharedUsers', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SharedUsers {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)

    wrapper.instance().toggleDrawer()
  })

  it('should render empty content', () => {
    wrapper.setProps({ study: { ...initialProps.study, shared_users: [] } })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should not render add button', () => {
    wrapper.setProps({ editable: false })
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should add user to study', () => {
    wrapper.instance().handleAdd({ user: 1 })
    expect(initialProps.updateStudy).not.toHaveBeenCalled()

    wrapper.instance().handleAdd({ user: 3 })
    expect(initialProps.updateStudy).toHaveBeenCalledWith({
      id: initialProps.study.id,
      data: {
        shared_users: [1, 2, 3],
      },
    })
  })

  it('should delete user from study', () => {
    wrapper.instance().handleDeleteUser(initialProps.study.shared_users[0])
    expect(initialProps.updateStudy).toHaveBeenCalledWith({
      id: initialProps.study.id,
      data: {
        shared_users: [2],
      },
    })
  })

  it('shod close drawer', () => {
    wrapper.setProps({ status: UPDATE_STUDY })
    wrapper.setProps({ status: successAction(UPDATE_STUDY) })
    expect(wrapper.state('showAddDrawer')).toBeFalsy()
  })

  it('should click delete button', () => {
    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')
  })
})
