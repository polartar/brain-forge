import React from 'react'
import { mount } from 'enzyme'
import update from 'immutability-helper'
import { Tabs, Tag } from 'antd'
import { PapayaViewer } from 'components'
import DataFileTab from '../DataFileTab'

const { TabPane } = Tabs

const initialProps = {
  dataFile: {
    files: ['class.csv', 'test.nii'],
    format: 'format',
    name: 'class.csv',
    uploaded_by: 'User1',
    path: 'brainforge',
    shared_users: [{ username: 'user2', email: 'user2@email.com' }],
    study_info: { full_name: 'Study' },
    scanner_info: { full_name: 'Scanner' },
    series_info: { modality: { full_name: 'Structural MRI' }, label: 'Series' },
    session_info: { segment_interval: 'Session1' },
    series: {
      id: 1,
      label: 'Series',
      is_managed: false,
    },
  },
}

describe('DataFileTab', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<DataFileTab {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(2)
    expect(wrapper.find(Tag).length).toBe(initialProps.dataFile.files.length + 2)

    wrapper.setProps({ dataFile: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('should show Papaya Viewer', () => {
    const updatedProps = update(initialProps, {
      dataFile: {
        name: { $set: 'test.nii' },
        format: { $set: null },
        shared_users: { $set: [] },
        series: { is_managed: { $set: true } },
      },
    })
    wrapper.setProps(updatedProps)

    wrapper
      .find('.ant-tabs-tab')
      .last()
      .simulate('click')

    expect(wrapper.find(TabPane).length).toBe(3)
    expect(wrapper.find(PapayaViewer).length).toBe(1)
  })
})
