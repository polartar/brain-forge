import React from 'react'
import { mount } from 'enzyme'
import { keys } from 'lodash'
import Summary from '../Summary'

const initialProps = {
  summary: [
    {
      Metric: 'SIGNAL',
      Mean: 9341.06,
      STD: 0,
    },
    {
      Metric: 'SIGNAL_P2P',
      Mean: 5.8900000000000015,
      STD: 0,
    },
    {
      Metric: 'SNR',
      Mean: 1503.2399999999998,
      STD: 0,
    },
    {
      Metric: 'GHOST',
      Mean: 56.85999999999999,
      STD: 0,
    },
  ],
}

describe('Summary test', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<Summary {...initialProps} />)
  })

  test('render component', () => {
    expect(wrapper.find('th').length).toBe(keys(initialProps.summary[0]).length)
    expect(wrapper.find('tr').length).toBe(initialProps.summary.length + 1)
  })
})
