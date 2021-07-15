import React from 'react'
import { shallow } from 'enzyme'
import { WMHResult } from 'components'
import { FileInfo, PapayaViewer } from 'components'
import OutputFileTree from '../OutputFileTree'

const initialProps = {
  data: {
    all_files: ['file1.nii', 'file2.nii', 'WMH_Mask_bin.nii'],
    out_dir: 'media/output/v000/123+456/',
  },
}

describe('WMHResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<WMHResult {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(PapayaViewer).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
