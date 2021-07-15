import React from 'react'
import { shallow } from 'enzyme'
import Highcharts from 'react-highcharts'
import { PhantomAnalysisMocks } from 'test/mocks'
import MetricChart from '../MetricChart'

const initialProps = {
  analyses: PhantomAnalysisMocks,
}

describe('MetricChart', () => {
  it('should render component', () => {
    const wrapper = shallow(<MetricChart {...initialProps} />)
    expect(wrapper.find(Highcharts).length).toBe(
      Object.keys(initialProps.analyses[0].fmri_phantom_qa_data[0]).length - 1,
    )
  })
})
