import React from 'react'
import { shallow } from 'enzyme'
import { Sidebar } from '../index'
import DesktopSidebar from '../Desktop'
import MobileSidebar from '../Mobile'

describe('Sidebar', () => {
  it('should render sidebar', () => {
    const wrapper = shallow(<Sidebar isDesktop />)

    expect(wrapper.find(DesktopSidebar).length).toBe(1)

    wrapper.setProps({ isDesktop: false })

    expect(wrapper.find(MobileSidebar).length).toBe(1)
  })
})
