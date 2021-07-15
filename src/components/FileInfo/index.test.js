import React from 'react'
import { shallow } from 'enzyme'
import { Alert, Descriptions } from 'antd'
import FileInfo from './index'
import { FileMock } from 'test/mocks'

const { Item } = Descriptions

const initialProps = {
  dataFile: FileMock(),
}

describe('FileInfo', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FileInfo {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Item).length).toBe(13)

    wrapper.setProps({ dataFile: null })
    expect(wrapper.find(Descriptions).length).toBe(0)
    expect(wrapper.find(Alert).length).toBe(1)
  })
})
