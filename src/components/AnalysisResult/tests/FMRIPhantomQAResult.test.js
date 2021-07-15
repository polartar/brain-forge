import React from 'react'
import { shallow } from 'enzyme'
import FMRIPhantomQAResult from '../FMRIPhantomQAResult'
import { OutputFileTree } from 'components'

const initialProps = {
  data: {
    all_files: ['file1', 'file2'],
    figure_lookup: {
      mean_signal_montage: 'a',
      min_mean_signal_montage: 'b',
      std_dev_montage: 'c',
      temporal_snr_montage: 'd',
      mean_signal_by_slice: 'e',
      signal_p2p_by_slice: 'f',
      snr_by_slice: 'g',
      ghost_by_slice: 'h',
      mean_signal_by_time: 'i',
      snr_by_time: 'j',
      ghost_by_time: 'k',
    },
    report: {
      slice: 1,
      signal: 0.65,
      'signal_p2p (%)': 1.2,
      snr: 600,
      'ghost (%)': 0.5,
    },
  },
}

describe('FMRIPhantomQAResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FMRIPhantomQAResult {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('Text').length).toBe(5)
    expect(wrapper.find('img').length).toBe(11)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
