import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { FreeSurfer7Result, FileInfo, OutputFileTree } from 'components'

const { TabPane } = Tabs

const initialProps = {
  data: {
    all_files: ['file1.nii', 'file2.nii'],
    stats_files: [[[{ headers: ['h1', 'h2'], data: ['abc'], columns: [{ id: 'id' }] }]]],
  },
}

describe('FreeSurfer7Result', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FreeSurfer7Result {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(3)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
