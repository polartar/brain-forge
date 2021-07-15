import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { SPMGLMLevel1Result } from 'components'
import OutputFileTree from '../OutputFileTree'
import { FileInfo } from 'components'

const { TabPane } = Tabs

const initialProps = {
  token: 'ABCDEF',
  data: {
    figures: ['1-DesignMatrix', '2-DesignMatrix', '3-Stat', '4-Stat'],
    out_dir: '/out',
    save_path: '/out',
  },
}

describe('SPMGLMLevel1Result', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SPMGLMLevel1Result {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(6)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('img').length).toBe(4)
  })
})
