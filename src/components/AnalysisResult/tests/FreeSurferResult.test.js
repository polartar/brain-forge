import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { FreeSurferResult, FileInfo, OutputFileTree } from 'components'
import { FreeSurferResultMocks } from 'test/mocks'

const { TabPane } = Tabs

const initialProps = {
  data: FreeSurferResultMocks
}

describe('FreeSurferResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FreeSurferResult {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(3)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    //TODO: should make these tests pass
    //expect(wrapper.find(Select).length).toBe(2)
    //expect(wrapper.find(Table).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
