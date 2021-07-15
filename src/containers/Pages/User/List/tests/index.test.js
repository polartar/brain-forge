import React from 'react'
import { shallow } from 'enzyme'
import { Switch } from 'antd'

import { UserPage } from '../index'
import UserTable from '../UserTable'

const initialProps = {}

describe('UserPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<UserPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Switch).length).toBe(1)
    expect(wrapper.find(UserTable).length).toBe(1)
  })
})
