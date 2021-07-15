import React from 'react'
import { shallow } from 'enzyme'
import { Menu as AntMenu } from 'antd'
import Menu from '../Menu'

const { Item: MenuItem } = AntMenu

const initialProps = {
  collapsed: false,
  version: '1.0',
  isSuperUser: true,
  location: {
    pathname: '/',
  },
  history: {
    push: jest.fn(),
  },
}

describe('Menu', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Menu {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(MenuItem).length).toBe(14)
    expect(wrapper.find('img').length).toBe(1)

    wrapper.setProps({ collapsed: true })

    expect(wrapper.find('img').length).toBe(2)

    wrapper.setProps({ isSuperUser: false })
    expect(wrapper.find(MenuItem).length).toBe(12)
  })

  it('should redirect to pages', () => {
    wrapper.find('.sidebar__logo').simulate('click')

    expect(initialProps.history.push).toHaveBeenCalledWith('/study')
  })
})
