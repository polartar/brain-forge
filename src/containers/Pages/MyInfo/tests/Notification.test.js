import React from 'react'
import { mount, shallow } from 'enzyme'
import { Alert, Empty, Button } from 'antd'
import { LIST_NOTIFICATION } from 'store/modules/auth'
import { Loader } from 'components'
import { UserMock } from 'test/mocks'
import { MyNotification } from '../Notification'

const initialProps = {
  user: UserMock(),
  notifications: [
    { id: 1, message: 'Message 1', send_date: '2019-06-01', type: 0 },
    { id: 2, message: 'Message 2', send_date: '2019-06-02', type: 1 },
  ],
  status: 'INIT',
  listNotification: jest.fn(),
  deleteNotification: jest.fn(),
}

describe('MyNotification', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<MyNotification {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listNotification).toHaveBeenCalled()
    expect(wrapper.find(Alert).length).toBe(initialProps.notifications.length)
  })

  it('should delete notification', () => {
    wrapper.find(Alert).map(alert => alert.props().onClose())
    wrapper.find(Button).simulate('click')

    expect(initialProps.deleteNotification).toHaveBeenCalledTimes(initialProps.notifications.length + 1)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: LIST_NOTIFICATION })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ notifications: [] })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should set socket', () => {
    const props = {
      ...initialProps,
      listNotification: jest.fn(),
    }
    wrapper = shallow(<MyNotification {...props} />)

    const socket = wrapper.instance().socket

    socket.onmessage({ data: 'init' })
    socket.onmessage({ data: 'update' })

    expect(props.listNotification).toHaveBeenCalled()
  })
})
