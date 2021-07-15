import React from 'react'
import { mount } from 'enzyme'
import { Table } from 'antd'
import { SortTable } from './SortTable'

const initialProps = {
  selectedKeys: ['datafile;1;node-1.nii', 'datafile;2;node-2.nii'],
  selectedFiles: ['node-1.nii', 'node-2.nii'],
  className: '',
  style: {},
  onChange: jest.fn(),
}

describe('SortTable', () => {
  it('should render components', () => {
    const wrapper = mount(<SortTable {...initialProps} />)
    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find('.ant-table-tbody tr').length).toBe(2)
  })

  it('should drag data file tree', () => {
    const wrapper = mount(<SortTable {...initialProps} />)
    const cellTableFirst = wrapper.find('.ant-table-tbody tr').first()
    cellTableFirst
      .find('.drag-visible')
      .first()
      .simulate('click')
  })
})
