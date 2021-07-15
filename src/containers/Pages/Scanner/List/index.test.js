import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import update from 'immutability-helper'
import { shallow, mount } from 'enzyme'
import { Button, Table } from 'antd'
import { CREATE_SCANNER, DELETE_SCANNER } from 'store/modules/sites'
import { ScannerForm } from 'components'
import { SitesMock, UserMock, ScannersMock } from 'test/mocks'
import { successAction } from 'utils/state-helpers'
import { ScannerListPage } from './index'

const initialProps = {
  user: UserMock(),
  sites: SitesMock(4),
  scanners: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 4,
    results: ScannersMock(4),
  },
  status: 'INIT',
  isDesktop: true,
  isMobile: false,
  listSite: jest.fn(),
  listScanner: jest.fn(),
  createScanner: jest.fn(),
  // updateScanner: jest.fn(),
  deleteScanner: jest.fn(),
}

describe('ScannerListPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ScannerListPage {...initialProps} />)
  })

  it('should render component', () => {
    // expect(wrapper.find(Button).length).toBe(7)
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Table).length).toBe(1)

    wrapper
      .find('.add-btn')
      .first()
      .simulate('click')
    expect(wrapper.find(ScannerForm).length).toBe(1)
    expect(initialProps.listScanner).toHaveBeenCalledTimes(1)

    wrapper.setProps({ isDesktop: false, isMobile: true })
  })

  it('should handle form submit', () => {
    wrapper
      .find('.add-btn')
      .first()
      .simulate('click')
    expect(wrapper.find(ScannerForm).length).toBe(1)

    const createPayload = {
      id: undefined,
      data: {
        full_name: 'Scanner 1',
        label: 'scanner-1',
      },
    }

    wrapper
      .find(ScannerForm)
      .props()
      .onSubmit(createPayload)
    expect(initialProps.createScanner).toHaveBeenCalledWith({
      ...createPayload.data,
      site: initialProps.user.site,
    })

    wrapper.setProps({ user: { ...UserMock(), is_superuser: true } })
    wrapper
      .find(ScannerForm)
      .props()
      .onSubmit(createPayload)
    expect(initialProps.createScanner).toHaveBeenCalledWith(createPayload.data)
  })

  it('should handle pagination', () => {
    wrapper.setProps({ status: successAction(CREATE_SCANNER) })
    wrapper.setProps({ status: successAction(DELETE_SCANNER) })
    wrapper.instance().handleTableChange({ current: 2, pageSize: 2, total: 4 })
  })

  it('should list site', () => {
    const props = update(initialProps, {
      user: { is_superuser: { $set: true } },
      scanners: {
        results: {
          $set: initialProps.scanners.results.map(scanner => ({
            ...scanner,
            is_managed: scanner.id % 2 === 0,
          })),
        },
      },
    })
    wrapper = mount(
      <Router>
        <ScannerListPage {...props} />
      </Router>,
    )
    wrapper.find('.delete-btn').map(deleteBtn => deleteBtn.simulate('click'))

    expect(props.listSite).toHaveBeenCalledTimes(1)
  })
})
