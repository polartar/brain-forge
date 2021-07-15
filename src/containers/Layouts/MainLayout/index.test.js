import React from 'react'
import { shallow } from 'enzyme'
import { Header, Sidebar } from 'containers'
import MainLayout from './index'

describe('MainLayout', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MainLayout />)
  })

  it('should render component', () => {
    expect(wrapper.find(Header).length).toBe(1)
    expect(wrapper.find(Sidebar).length).toBe(1)
  })
})
