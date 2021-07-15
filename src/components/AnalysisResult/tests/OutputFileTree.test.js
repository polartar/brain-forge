import React from 'react'
import { shallow } from 'enzyme'
import { Tree } from 'antd'
import OutputFileTree from '../OutputFileTree'

const { DirectoryTree } = Tree

const initialProps = {
  files: ['file1', 'file2'],
}

describe('OutputFileTree', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<OutputFileTree {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(DirectoryTree).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ files: [] })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
