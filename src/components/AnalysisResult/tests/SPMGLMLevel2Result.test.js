import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { FileInfo, OutputFileTree, SPMGLMLevel2Result } from 'components'

const { TabPane } = Tabs

const initialProps = {
  data: {
    all_files: ['con_0001.nii', 'con_0001.nii'],
    figures: ['1-DesignMatrix', '2-DesignMatrix', '3-Stat', '4-Stat'],
    save_path: 'media/output/v000/123+456/',
  },
}

describe('SPMGLMLevel2Result', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SPMGLMLevel2Result {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(6)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('img').length).toBe(4)
  })
})
