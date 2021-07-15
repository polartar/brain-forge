import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { ASLResult, FileInfo, OutputFileTree } from 'components'

const { TabPane } = Tabs

const initialProps = {
  data: {
    all_files: ['file1.nii', 'file2.nii'],
    out_dir: 'media/output/v000/123+456/',
  },
}

describe('ASLResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ASLResult {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(4)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
