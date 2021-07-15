import React from 'react'
import axios from 'axios'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount, shallow } from 'enzyme'
import { UsersMock } from 'test/mocks'
import { Modal, Table } from 'antd'

import { UserTable } from '../UserTable'

const initialProps = {
  editable: true,
  users: UsersMock(),
  isLoading: false,
  setSelectedKeys: [],
  selectedKeys: '',
  listUser: jest.fn(),
  confirm: jest.fn(),
  clearFilters: jest.fn(),
}

describe('UserTable', () => {
  it('should render component', () => {
    const wrapper = shallow(<UserTable {...initialProps} />)

    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find(Modal).length).toBe(1)
  })

  it('should render table', () => {
    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: UsersMock(3) })

    const props = {
      ...initialProps,
      users: UsersMock(3),
    }

    mount(
      <Router>
        <UserTable {...props} />
      </Router>,
    )
    expect(axios.get).toHaveBeenCalledWith('/auth/user/')
  })
})
