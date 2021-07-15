import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { FMRI32Result, FileInfo, OutputFileTree } from 'components'

const { TabPane } = Tabs

const initialProps = {
  data: {
    all_files: ['file1.nii', 'file2.nii'],
    figures: ['Epi_Motion-1.png', 'QAreg-1.png', 'graph.png', 'graph_detailed.png'],
  },
}

describe('FMRI32Result', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FMRI32Result {...initialProps} />)
  })

  it('should render component', () => {
    const { data } = initialProps
    expect(wrapper.find(TabPane).length).toBe(9)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('img').length).toBe(data.figures.length)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
