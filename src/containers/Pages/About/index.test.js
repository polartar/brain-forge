import React from 'react'
import { mount } from 'enzyme'
import { About } from './index'

const initialProps = {
  version: '1.0.0',
}

describe('AboutPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<About {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find('h5').html()).toContain(initialProps.version)
  })
})
