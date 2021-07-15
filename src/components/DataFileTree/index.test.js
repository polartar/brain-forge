import React from 'react'
import axios from 'axios'
import { mount, shallow } from 'enzyme'
import { Table, TreeSelect, Switch } from 'antd'

import { runPromisesAsync } from 'utils/common'

import { AnalysisTypeMock, dataFilesMock } from 'test/mocks'
import { DataFileTree } from './index'

const initialProps = {
  analysisType: AnalysisTypeMock(),
  analysis: null,
  multiple: true,
  subjectOrder: [],
  onChange: jest.fn(),
  onUpdateFields: jest.fn(),
  debounceDelay: 0,
}

describe('DataFileTree', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render component', () => {
    const wrapper = shallow(<DataFileTree {...initialProps} />)
    expect(wrapper.find(TreeSelect).length).toBe(1)
  })

  it('should allow search tree and open drag-table', async () => {
    axios.get = jest.fn()
    const data = { data: { currentPage: 1, pageSize: 10, results: dataFilesMock(10), totalCount: 20 } }

    axios.get.mockResolvedValue(data)

    const wrapper = mount(<DataFileTree {...initialProps} />)

    const inputSearch = wrapper.find('input[type="text"]')
    expect(inputSearch.length).toBe(1)

    inputSearch.simulate('change', { target: { value: 'node-1' } })
    inputSearch.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    const fileNode = wrapper.find('.ant-select-tree-title').last()
    expect(fileNode.text()).toEqual('node-1.nii')

    fileNode.simulate('click')

    // Open up drag table.
    expect(wrapper.find(TreeSelect).length).toBe(1)
    expect(wrapper.find(Table).length).toBe(0)

    expect(wrapper.find(Switch).length).toBe(1)
    wrapper.find(Switch).simulate('click')

    expect(wrapper.find(TreeSelect).length).toBe(0)
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should update tree', () => {
    const wrapper = mount(<DataFileTree {...initialProps} />)
    wrapper
      .find(TreeSelect)
      .props()
      .onTreeExpand('node-1')
  })

  it('should load more data on scroll down', async () => {
    axios.get = jest.fn()
    const data = { data: { currentPage: 1, pageSize: 10, results: dataFilesMock(10), totalCount: 20 } }

    axios.get.mockResolvedValue(data)

    const wrapper = mount(<DataFileTree {...initialProps} />)

    const inputSearch = wrapper.find('input[type="text"]')
    expect(inputSearch.length).toBe(1)

    inputSearch.simulate('change', { target: { value: '.nii' } })
    inputSearch.simulate('click')

    expect(axios.get).toHaveBeenCalledTimes(2)

    await runPromisesAsync()
    wrapper.update()

    // NodeFile 10 item.
    expect(wrapper.find('.filter-node').length).toBe(10)

    const data2 = { data: { currentPage: 2, pageSize: 10, results: dataFilesMock(10), totalCount: 20 } }

    axios.get.mockResolvedValue(data2)

    const treeSelect = wrapper.find(TreeSelect)
    treeSelect
      .find('.ant-select')
      .simulate('scroll', { target: { scrollHeight: 500, scrollTop: 100, clientHeight: 500 } })

    await runPromisesAsync()
    wrapper.update()

    expect(axios.get).toHaveBeenCalledTimes(4)
  })

  it('should handle click series session subject on search', async () => {
    axios.get = jest.fn()
    const data = { data: { currentPage: 1, pageSize: 10, results: dataFilesMock(10), totalCount: 20 } }

    axios.get.mockResolvedValue(data)

    const wrapper = mount(<DataFileTree {...initialProps} />)

    const inputSearch = wrapper.find('input[type="text"]')
    expect(inputSearch.length).toBe(1)

    inputSearch.simulate('change', { target: { value: 'node' } })
    inputSearch.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    const treeSelect = wrapper.find(TreeSelect)

    // Select series => choice 10 datafile.
    treeSelect.find('.ant-select').simulate('click')
    wrapper
      .find('span')
      .find('[title="test_series"]')
      .simulate('click')
    expect(wrapper.find('.ant-select-selection__choice__content').length).toBe(10)

    // Select session => no choice 10 datafile.
    treeSelect.find('.ant-select').simulate('click')
    wrapper
      .find('span')
      .find('[title="test_session"]')
      .simulate('click')
    expect(wrapper.find('.ant-select-selection__choice__content').length).toBe(0)

    // Select subject => choice 10 datafile.
    treeSelect.find('.ant-select').simulate('click')
    wrapper
      .find('span')
      .find('[title="test_subject"]')
      .simulate('click')
    expect(wrapper.find('.ant-select-selection__choice__content').length).toBe(10)
  })

  it('should open select tree, select file and display number of files selected', async () => {
    const wrapper = mount(<DataFileTree {...initialProps} />)

    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: [{ id: 1, full_name: 'Microsoft' }] })

    const inputSearch = wrapper.find('input[type="text"]')
    expect(inputSearch.length).toBe(1)

    inputSearch.simulate('change', { target: { value: '' } })

    await runPromisesAsync()
    wrapper.update()

    const treeSelect = wrapper.find(TreeSelect)
    expect(treeSelect.find('.ant-select').length).toBe(1)
    treeSelect.find('.ant-select').simulate('click')

    // Tree expand site => pi.
    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: [{ id: 1, username: 'test_pi' }] })

    const switcherSite = wrapper.find('[title="Microsoft"]').find('.ant-select-tree-switcher')
    expect(switcherSite.length).toBe(1)
    switcherSite.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    // Tree expand pi => study.
    treeSelect.find('.ant-select').simulate('click')
    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: [{ id: 1, full_name: 'Test Study' }] })

    const switcherPi = wrapper.find('[title="test_pi"]').find('.ant-select-tree-switcher')
    expect(switcherPi.length).toBe(1)
    switcherPi.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    // Tree expand study => subject.
    treeSelect.find('.ant-select').simulate('click')
    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: [{ id: 1, anon_id: 'test_subject' }] })

    const switcherStudy = wrapper.find('[title="Test Study"]').find('.ant-select-tree-switcher')
    expect(switcherStudy.length).toBe(1)
    switcherStudy.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    // Tree expand subject => session.
    treeSelect.find('.ant-select').simulate('click')
    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: [{ id: 1, segment_interval: 'test_session' }] })

    const switcherSubject = wrapper.find('[title="test_subject"]').find('.ant-select-tree-switcher')
    expect(switcherSubject.length).toBe(1)
    switcherSubject.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    // Tree expand session => series.
    treeSelect.find('.ant-select').simulate('click')
    axios.get = jest.fn()
    axios.get.mockResolvedValue({ data: [{ id: 1, label: 'test_series' }] })

    const switcherSession = wrapper.find('[title="test_session"]').find('.ant-select-tree-switcher')
    expect(switcherSession.length).toBe(1)
    switcherSession.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    // Tree expand series => file.
    treeSelect.find('.ant-select').simulate('click')
    axios.get = jest.fn()
    axios.get.mockResolvedValue({
      data: [{ id: 1, files: ['node-1.nii'], name: 'node-1.nii' }],
    })

    const switcherSeries = wrapper.find('[title="test_series"]').find('.ant-select-tree-switcher')
    expect(switcherSeries.length).toBe(1)
    switcherSeries.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    // Select File node-1.nii.
    treeSelect.find('.ant-select').simulate('click')

    const selectFile = wrapper.find('span')
    selectFile.find('[title="node-1.nii"]').simulate('click')

    expect(initialProps.onChange).toBeCalledTimes(1)
    const itemsSelectedWrapper = wrapper.find('.items-selected-count')
    expect(itemsSelectedWrapper.text()).toBe('1 files selected')
  })

  it('should allow search tree and select one file', async () => {
    axios.get = jest.fn()
    const data = { data: { currentPage: 1, pageSize: 10, results: dataFilesMock(10), totalCount: 20 } }

    axios.get.mockResolvedValue(data)

    const wrapper = mount(<DataFileTree {...initialProps} />)

    const inputSearch = wrapper.find('input[type="text"]')
    expect(inputSearch.length).toBe(1)

    inputSearch.simulate('change', { target: { value: 'node-1' } })
    inputSearch.simulate('click')

    await runPromisesAsync()
    wrapper.update()

    const fileNode = wrapper.find('.ant-select-tree-title').last()
    expect(fileNode.text()).toEqual('node-1.nii')

    fileNode.simulate('click')

    expect(initialProps.onChange).toBeCalledTimes(1)
  })
})
