import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { SummaryTable, PolyssifierResult } from 'components'
import { SummaryMock, FigureMock } from 'test/mocks'
import { FileInfo } from 'components'

const { TabPane } = Tabs

const initialProps = {
  data: {
    test_summary: null,
    train_summary: SummaryMock(2),
    confusions: {
      'Linear SVM': [[4347, 644], [582, 4427]]
    },
    figures: FigureMock(2),
  },
}

describe('PolyssifierResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PolyssifierResult {...initialProps} />)
  })

  it('should render component', () => {
    const { data } = initialProps

    const { train_summary, confusions, figures } = data
    const summaryCount = train_summary.length + Object.keys(confusions).length

    expect(wrapper.find(TabPane).length).toBe(5)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(SummaryTable).length).toBe(summaryCount)
    expect(wrapper.find('img').length).toBe(figures.length)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
