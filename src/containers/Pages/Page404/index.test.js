import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { mount } from 'enzyme'
import Page404 from './index'

describe('Page404', () => {
  it('should render component', () => {
    const wrapper = mount(
      <Router>
        <Page404 />
      </Router>,
    )
    expect(wrapper.find(Link).length).toBe(1)
  })
})
