import React from 'react'
import { shallow } from 'enzyme'
import { Tabs as AntTabs } from 'antd'
import { ResponsiveTabs } from './index'

const initialProps = {
  isMobile: true,
}

describe('ResponsiveTabs', () => {
  it('should render component', () => {
    const wrapper = shallow(<ResponsiveTabs {...initialProps} />)

    expect(wrapper.find(AntTabs).props().tabPosition).toBe('top')

    wrapper.setProps({ isMobile: false })
    expect(wrapper.find(AntTabs).props().tabPosition).toBe('left')
  })
})
