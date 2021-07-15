import React from 'react'
import { Button, Drawer } from 'antd'
import { shallow } from 'enzyme'
import { MiscFileForm } from 'components'
import MiscFileDrawer from './MiscFileDrawer'

const initialProps = {
  disabled: false,
}

describe('MiscFile', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MiscFileDrawer {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Drawer).length).toBe(1)
  })

  it('should show drawers', () => {
    wrapper.find(Button).simulate('click')
    expect(wrapper.find(MiscFileForm).length).toBe(1)
  })
})
