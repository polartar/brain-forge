import React from 'react'
import { shallow } from 'enzyme'
import { Tabs, TabPane } from 'components'
import MyInfo from '../index'

const initialProps = {
  match: {
    params: { page: 'profile' },
  },
  history: {
    push: jest.fn(),
  },
}

describe('MyInfo', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MyInfo {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(3)
  })

  it('should redirect if page is not available', () => {
    wrapper.setProps({ match: { params: { page: 'page' } } })
    expect(initialProps.history.push).toHaveBeenCalledWith('/not-found')
  })

  it('should go to nav page', () => {
    const tabs = wrapper.find(Tabs)
    tabs.props().onTabClick('profile')

    expect(initialProps.history.push).toHaveBeenCalledWith(`/me/profile`)
  })
})
