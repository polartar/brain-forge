import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { DTIResult, FileInfo, OutputFileTree } from 'components'
import { FilesMock } from 'test/mocks'

const { TabPane } = Tabs

const initialProps = {
  data: {
    all_files: FilesMock(),
    figures: ['eddy-1.png', 'eddy-2.png', 'tbss-1.png', 'tbss-2.png'],
    save_path: 'media/output/v000/123+456/',
  },
}

describe('DTIResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DTIResult {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(6)
    expect(wrapper.find(FileInfo).length).toBe(1)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('img').length).toBe(4)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
