import React from 'react'
import { mount } from 'enzyme'
import { Empty } from 'antd'
import { Select } from 'components'
import { SiteMock } from 'test/mocks'
import SiteAdmin from '../Admin'

const initialProps = {
  site: SiteMock(),
  stauts: 'INIT',
  setAdmin: jest.fn(),
}

describe('SiteAdmin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SiteAdmin {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Select).length).toBe(1)
    const select = wrapper.find(Select)
    select.props().onChange(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ site: { ...initialProps.site, members: [] } })
    expect(wrapper.find(Empty).length).toBe(1)
  })
})
