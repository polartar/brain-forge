import React from 'react'
import { shallow } from 'enzyme'
import { Drawer as AntDrawer } from 'antd'
import { Drawer } from './index'

const initialProps = {
  isMobile: true,
}

describe('Drawer', () => {
  it('should render component', () => {
    const wrapper = shallow(<Drawer {...initialProps} />)

    expect(wrapper.find(AntDrawer).props().width).toBe('100%')

    wrapper.setProps({ isMobile: false })
    expect(wrapper.find(AntDrawer).props().width).toBe(500)
  })
})
