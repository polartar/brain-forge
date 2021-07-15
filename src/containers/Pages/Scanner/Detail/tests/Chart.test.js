import React from 'react'
import { shallow } from 'enzyme'
import { Alert, Radio, Select } from 'antd'
import { PhantomAnalysisMocks } from 'test/mocks'
import ScannerChart from '../Chart'
import MetricChart from '../MetricChart'
import DateChart from '../DateChart'

const initialProps = {
  phantomAnalyses: PhantomAnalysisMocks,
}

describe('ScannerChart', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ScannerChart {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(MetricChart).length).toBe(1)
    expect(wrapper.find(Radio.Group).length).toBe(1)
  })

  it('should change chart type', () => {
    wrapper
      .find(Radio.Group)
      .props()
      .onChange({ target: { value: 'date' } })
    wrapper
      .find(Select)
      .props()
      .onChange(initialProps.phantomAnalyses.map(analysis => analysis.id))
    expect(wrapper.find(DateChart).length).toBe(1)
  })

  it('should render alert', () => {
    wrapper = shallow(<ScannerChart phantomAnalyses={[]} />)
    expect(wrapper.find(Alert).length).toBe(1)
  })

  it('should select all analyses', () => {
    wrapper.find('.select-all-button').simulate('click')

    expect(wrapper.find('.analysis-legend-item').length).toBe(initialProps.phantomAnalyses.length)
  })

  it('should deselect all analyses', () => {
    wrapper.find('.deselect-all-button').simulate('click')

    expect(wrapper.find('.analysis-legend').length).toBe(0)
  })
})
