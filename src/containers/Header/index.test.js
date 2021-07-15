import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Menu } from 'antd'
import { UserMock } from 'test/mocks'
import { Header } from './index'

const { Item: MenuItem } = Menu

const initialProps = {
  user: UserMock(),
  history: {
    push: jest.fn(),
    goBack: jest.fn(),
  },
  notifications: [{ id: 1, message: 'Hi' }],
  isSidebarPinned: false,
  isDesktop: true,
  toggleSidebarPin: jest.fn(),
  listNotification: jest.fn(),
  logOut: jest.fn(),
}

describe('Header', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<Header {...initialProps} />)
  })

  it('should render component', () => {
    const { first_name, last_name } = initialProps.user
    const userButton = wrapper.find(Button).last()

    expect(wrapper.find(Button).length).toBe(4)
    expect(userButton.html()).toContain(`${first_name} ${last_name}`)
    expect(initialProps.listNotification).toHaveBeenCalledTimes(1)

    wrapper.setProps({ isSidebarPinned: true })

    const pinButton = wrapper.find(Button).first()
    expect(pinButton.props().type).toBe('primary')
  })

  it('should trigger pin button click', () => {
    const pinButton = wrapper.find(Button).first()

    pinButton.simulate('click')
    expect(initialProps.toggleSidebarPin).toHaveBeenCalledTimes(1)

    wrapper.setProps({ isDesktop: false })
  })

  it('should trigger go back button click', () => {
    const backButton = wrapper.find(Button).at(1)

    backButton.simulate('click')
    expect(initialProps.history.goBack).toHaveBeenCalledTimes(1)
  })

  it('should trigger notification button click', () => {
    const notificationButton = wrapper.find(Button).at(2)

    notificationButton.simulate('click')
    expect(initialProps.history.push).toHaveBeenCalledWith('/me/notification')
  })

  it('should trigger menu click', () => {
    const userButton = wrapper.find(Button).last()
    userButton.simulate('click')

    const profileMenuItem = wrapper.find(MenuItem).first()
    const logOutMenuItem = wrapper.find(MenuItem).last()

    profileMenuItem.simulate('click')
    logOutMenuItem.simulate('click')

    expect(initialProps.history.push).toHaveBeenCalledWith('/me/profile')
    expect(initialProps.logOut).toHaveBeenCalledTimes(1)
  })

  it('should set socket', () => {
    const props = {
      ...initialProps,
      listNotification: jest.fn(),
    }
    wrapper = shallow(<Header {...props} />)

    const socket = wrapper.instance().socket
    socket.onmessage({ data: 'init' })
    socket.onmessage({ data: 'update' })

    expect(props.listNotification).toHaveBeenCalled()
  })
})
