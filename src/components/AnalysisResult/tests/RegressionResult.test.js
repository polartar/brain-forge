import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { SummaryTable, RegressionResult, FileInfo } from 'components'
import { SummaryMock } from 'test/mocks'

const { TabPane } = Tabs

const initialProps = {
  data: {
    summary: SummaryMock(3),
  },
}

describe('RegressionResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<RegressionResult {...initialProps} />)
  })

  it('should render component', () => {
    const { data } = initialProps
    expect(wrapper.find(TabPane).length).toBe(2)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(SummaryTable).length).toBe(data.summary.length)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()

    wrapper.setProps({ data: { summary: null } })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
