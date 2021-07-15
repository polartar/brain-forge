import React from 'react'
import { mount } from 'enzyme'
import Logo from './index'

describe('Logo', () => {
  it('should render component', () => {
    const wrapper = mount(<Logo />)
    expect(wrapper.find('img').length).toBe(2)
  })
})
