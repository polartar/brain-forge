import React from 'react'
import update from 'immutability-helper'
import { BrowserRouter as Router } from 'react-router-dom'
import { shallow, mount } from 'enzyme'
import { Empty, Table, Button } from 'antd'
import { CREATE_SITE, LIST_SITE } from 'store/modules/sites'
import { SiteAddForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { SiteMock } from 'test/mocks'
import { SiteListPage } from './index'

const initialProps = {
  sites: [SiteMock(1), { ...SiteMock(2), invites: [] }],
  status: 'INIT',
  isDesktop: false,
  listSite: jest.fn(),
  createSite: jest.fn(),
  deleteSite: jest.fn(),
}

describe('SiteListPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SiteListPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listSite).toHaveBeenCalledTimes(1)
    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find(SiteAddForm).length).toBe(1)

    const props = update(initialProps, { sites: { 0: { invites: { $set: [] } } } })
    wrapper.setProps(props)
  })

  it('should render empty', () => {
    wrapper.setProps({ sites: [] })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should not open drawer', () => {
    wrapper.setState({ showAddDrawer: true })
    wrapper.setProps({ status: LIST_SITE, isDesktop: true })

    wrapper.find(Button).simulate('click')
    expect(wrapper.state().showAddDrawer).toBeTruthy()

    wrapper.setProps({ status: 'INIT' })
    wrapper.find(Button).simulate('click')
    expect(wrapper.state().showAddDrawer).toBeFalsy()
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: successAction(CREATE_SITE) })
    expect(wrapper.state().showAddDrawer).toBeFalsy()
  })

  it('should handle form submit', () => {
    const form = wrapper.find(SiteAddForm)
    const values = { name: 'Site 2' }
    form.props().onSubmit(values)
    expect(initialProps.createSite).toHaveBeenCalledWith(values)
  })

  it('should trigger delete site', () => {
    wrapper = mount(
      <Router>
        <SiteListPage {...initialProps} />
      </Router>,
    )
    const button = wrapper.find('.delete-btn').first()
    button.simulate('click')
  })
})
