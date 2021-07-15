import React from 'react'
import { shallow, mount } from 'enzyme'
import { Button, Table, Empty } from 'antd'
import { UPDATE_ANALYSIS } from 'store/modules/analyses'
import { UserSelectForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { AnalysisMock, UsersMock, UserMock } from 'test/mocks'
import SharedUsers from '../SharedUsers'

const initialProps = {
  analysis: AnalysisMock(),
  user: UserMock(),
  users: UsersMock(),
  editable: true,
  status: 'INIT',
  updateAnalysis: jest.fn(),
}

describe('SharedUsers', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SharedUsers {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(UserSelectForm).length).toBe(1)
  })

  it('should delete user', () => {
    wrapper.instance().handleDeleteUser({ id: 1 })
    expect(initialProps.updateAnalysis).toHaveBeenCalledWith({
      id: initialProps.analysis.id,
      data: { shared_users: [2, 3] },
    })

    wrapper = mount(<SharedUsers {...initialProps} />)
    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')
  })

  it('show drawer', () => {
    const beforeShowDrawer = wrapper.state().showDrawer
    wrapper.find(Button).simulate('click')
    const afterShowDrawer = wrapper.state().showDrawer
    expect(beforeShowDrawer !== afterShowDrawer).toBeTruthy()
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: successAction(UPDATE_ANALYSIS) })
    expect(wrapper.state().showDrawer).toBeFalsy()
  })

  it('should render empty', () => {
    wrapper.setProps({ analysis: { ...initialProps.analysis, shared_users: [] } })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should not render buttons', () => {
    wrapper.setProps({ editable: false })
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should add user', () => {
    const updateMock = jest.fn()
    wrapper.setProps({ updateAnalysis: updateMock })
    const form = wrapper.find(UserSelectForm)
    form.props().onSubmit({ user: 1 })
    expect(updateMock).toHaveBeenCalledTimes(0)

    form.props().onSubmit({ user: 4 })
    expect(updateMock).toHaveBeenCalledWith({
      id: initialProps.analysis.id,
      data: {
        shared_users: [1, 2, 3, 4],
      },
    })
  })
})
