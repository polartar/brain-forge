import React from 'react'
import { shallow, mount } from 'enzyme'
import { Button, Table, Empty } from 'antd'
import { UPDATE_PARAMETER_SET } from 'store/modules/datafiles'
import { UserSelectForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { UserMock, UsersMock, ParameterSetMock } from 'test/mocks'
import SharedUsers from '../SharedUsers'

const initialProps = {
  parameterSet: ParameterSetMock(),
  user: UserMock(),
  users: UsersMock(3),
  editable: true,
  status: 'INIT',
  updateParameterSet: jest.fn(),
}

describe('SharedUsers', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SharedUsers {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find(UserSelectForm).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ parameterSet: { ...initialProps.parameterSet, shared_users: [] } })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should show drawer', () => {
    const beforeShowDrawer = wrapper.state().showDrawer
    wrapper.find(Button).simulate('click')
    const afterShowDrawer = wrapper.state().showDrawer
    expect(beforeShowDrawer !== afterShowDrawer).toBeTruthy()
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: successAction(UPDATE_PARAMETER_SET) })
    expect(wrapper.state().showDrawer).toBeFalsy()
  })

  it('should not render buttons', () => {
    wrapper.setProps({ editable: false })
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should delete user', () => {
    wrapper.instance().handleDeleteUser({ id: 1 })
    expect(initialProps.updateParameterSet).toHaveBeenCalledWith({
      id: initialProps.parameterSet.id,
      data: {
        shared_users: [2, 3],
      },
    })

    wrapper = mount(<SharedUsers {...initialProps} />)
    const button = wrapper.find('.delete-btn').first()
    button.simulate('click')
  })

  it('should add user', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ updateParameterSet: mockFn })

    const form = wrapper.find(UserSelectForm)
    form.props().onSubmit({ user: 1 })
    expect(mockFn).toHaveBeenCalledTimes(0)

    form.props().onSubmit({ user: 4 })
    expect(mockFn).toHaveBeenCalledWith({
      id: initialProps.parameterSet.id,
      data: {
        shared_users: [1, 2, 3, 4],
      },
    })
  })
})
