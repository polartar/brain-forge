import React from 'react'
import { shallow } from 'enzyme'
import { Layout } from 'antd'
import { DesktopSidebar } from '../Desktop'
import Menu from '../Menu'

const { Sider } = Layout

const initialProps = {
  version: '1.0.0',
  isSuperUser: false,
  isSidebarPinned: false,
  location: {
    pathname: '/',
  },
  history: {
    push: jest.fn(),
  },
}

describe('DesktopSidebar', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DesktopSidebar {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Sider).length).toBe(1)
    expect(wrapper.find(Menu).length).toBe(1)
  })

  it('should update collapse state', () => {
    wrapper.setProps({ isSidebarPinned: true })
    expect(wrapper.state().collapsed).toBeFalsy()

    wrapper.props().onMouseEnter()
    expect(wrapper.state().collapsed).toBeFalsy()

    wrapper.setProps({ isSidebarPinned: false })
    expect(wrapper.state().collapsed).toBeTruthy()
    wrapper.setProps({ isSidebarPinned: false })

    wrapper.props().onMouseEnter()
    expect(wrapper.state().collapsed).toBeFalsy()
  })
})
