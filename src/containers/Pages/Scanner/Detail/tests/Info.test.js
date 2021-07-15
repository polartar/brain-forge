import React from 'react'
import { shallow } from 'enzyme'
import { Descriptions } from 'antd'
import { ScannerMock, UserMock } from 'test/mocks'
import ScannerInfo from '../Info'

const { Item } = Descriptions

const initialProps = {
  scanner: ScannerMock(),
  user: UserMock(),
}

describe('ScannerInfo', () => {
  it('should render component', () => {
    const wrapper = shallow(<ScannerInfo {...initialProps} />)
    expect(wrapper.find(Item).length).toBe(7)
  })
})
