import React from 'react'
import { mount } from 'enzyme'
import Loader from './index'

describe('Loader', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<Loader />)
  })

  it('should render default loader', () => {
    expect(wrapper.exists('.ant-spin')).toBeTruthy()
  })

  it('should render custom loader', () => {
    wrapper.setProps({ size: 'default', className: 'left-loader' })

    expect(wrapper.exists('.ant-spin')).toBeTruthy()
    expect(wrapper.exists('.left-loader')).toBeTruthy()
  })
})
