import React from 'react'
import { mount } from 'enzyme'
import { UserMock } from 'test/mocks'
import { Descriptions, Tooltip } from 'antd'

import { CheckIcon } from 'components'

import { UserProfilePage } from './index'

const initialProps = {
  user: UserMock(),
}

describe('UserProfilePage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<UserProfilePage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Descriptions).length).toBe(1)
    expect(wrapper.find(Tooltip).length).toBe(1)
    expect(wrapper.find(CheckIcon).length).toBe(1)

    const itemContent = wrapper.find(Descriptions).find('.ant-descriptions-item-content')

    expect(itemContent.at(0).text()).toEqual('John')
    expect(itemContent.at(1).text()).toEqual('Doe')
    expect(itemContent.at(2).text()).toEqual('johndoe')
    expect(itemContent.at(3).text()).toEqual('johndoe@gmail.com')
  })
})
