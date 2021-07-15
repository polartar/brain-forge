import React from 'react'
import { shallow } from 'enzyme'
import { Button, Layout } from 'antd'
import { MobileSidebar } from '../Mobile'

const { Sider } = Layout

const initialProps = {
  version: '1.0.0',
  isSuperUser: false,
  isSidebarPinned: false,
}

describe('MobileSidebar', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MobileSidebar {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Sider).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(1)
  })

  it('should trigger sidebar open', () => {
    wrapper.find(Button).simulate('click')

    expect(
      wrapper
        .find(Sider)
        .props()
        .className.includes('sidebar--opened'),
    ).toBeTruthy()
    expect(wrapper.state().opened).toBeTruthy()
    expect(wrapper.find('.sidebar__back').length).toBe(1)

    wrapper.find('.sidebar__back').simulate('click')

    expect(wrapper.state().opened).toBeFalsy()
  })
})
