import React from 'react'
import { mount } from 'enzyme'
import { Select } from 'antd'
import Highcharts from 'react-highcharts'
import { PhantomAnalysisMocks } from 'test/mocks'
import DateChart from '../DateChart'

const initialProps = {
  analyses: PhantomAnalysisMocks,
}

describe('DateChart', () => {
  let wrapper = mount(<DateChart {...initialProps} />)

  it('should render component', () => {
    expect(wrapper.find(Highcharts).length).toBe(
      Object.keys(initialProps.analyses[0].fmri_phantom_qa_data[0]).length - 1,
    )
  })

  it('should change slice', () => {
    const slice = 1
    wrapper
      .find(Select)
      .props()
      .onChange(slice)
  })
})
