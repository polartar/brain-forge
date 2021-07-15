import React from 'react'
import { mount } from 'enzyme'
import Select from './index'

describe('Select', () => {
  let wrapper

  it('should render component', () => {
    wrapper = mount(<Select />)
    expect(wrapper.isEmptyRender()).toBeFalsy()
  })
})
