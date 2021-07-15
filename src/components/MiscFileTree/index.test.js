import React from 'react'
import axios from 'axios'
import { mount, shallow } from 'enzyme'

import { TreeSelect } from 'antd'
import { runPromisesAsync } from 'utils/common'

import { MiscFileTree } from './index'
import { miscFilesMock } from 'test/mocks'

const initialProps = {
  multiple: false,
  disabled: false,
  miscFile: miscFilesMock(1),
  listMiscFile: jest.fn(),
  onChange: jest.fn(),
}

describe('MiscFileTree', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MiscFileTree {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TreeSelect).length).toBe(1)
  })

  it('should select file', async () => {
    axios.get = jest.fn()
    const data = { data: { currentPage: 1, pageSize: 10, results: miscFilesMock(10), totalCount: 20 } }

    axios.get.mockResolvedValue(data)

    const wrapper = mount(<MiscFileTree {...initialProps} />)

    await runPromisesAsync()
    wrapper.update()

    const treeSelect = wrapper.find(TreeSelect)
    treeSelect.find('.ant-select').simulate('click')

    const switcherStudy = wrapper.find('[title="Test Study"]').find('.ant-select-tree-switcher')
    expect(switcherStudy.length).toBe(1)

    switcherStudy.simulate('click')

    const titleMiscFile = wrapper.find('span').find('[title="file-0.csv"]')
    expect(titleMiscFile.length).toBe(1)

    titleMiscFile.simulate('click')

    expect(initialProps.onChange).toHaveBeenCalledTimes(1)
  })
})
