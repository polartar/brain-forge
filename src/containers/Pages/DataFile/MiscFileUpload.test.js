import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Form, Input, Upload } from 'antd'

import { Drawer, StudyForm, Select, Option } from 'components'
import { StudiesMock, SitesMock } from 'test/mocks'
import { UPLOAD_MISC_FILES } from 'store/modules/datafiles'
import { MiscFileUpload } from './MiscFileUpload'

const { Item: FormItem } = Form

const initialProps = {
  sites: SitesMock(),
  studies: StudiesMock(),
  dataFileStatus: UPLOAD_MISC_FILES,
  listStudy: jest.fn(),
  listSite: jest.fn(),
  uploadMiscFiles: jest.fn(),
  onSubmit: jest.fn(),
}

describe('MiscFileUpload', () => {
  it('should render component', () => {
    const wrapper = mount(<MiscFileUpload {...initialProps} />)
    expect(wrapper.find(FormItem).length).toBe(4)
    expect(wrapper.find(Button).length).toBe(3)
    expect(initialProps.listStudy).toHaveBeenCalledTimes(1)
    expect(initialProps.listSite).toHaveBeenCalledTimes(1)
  })

  it('should show drawers', () => {
    const wrapper = shallow(<MiscFileUpload {...initialProps} />)
    wrapper.find('.study-add-btn').simulate('click')

    wrapper
      .find(StudyForm)
      .props()
      .onCancel()

    wrapper.find(Drawer).forEach(drawer => drawer.props().onClose())
  })

  it('should Upload MiscFile and submit', () => {
    const files = {
      fileList: [{ originFileObj: 'file' }],
    }

    const wrapper = shallow(<MiscFileUpload {...initialProps} />)

    const selectStudy = wrapper.find(Select)
    expect(selectStudy.length).toBe(1)

    selectStudy.simulate('click')

    const menuItem = wrapper.find(Option)
    expect(menuItem.length).toBe(1)

    menuItem.simulate('click')

    const description = wrapper.find(Input)
    expect(description.length).toBe(1)

    description.simulate('change', { target: { value: 'demo-123' } })

    wrapper
      .find(Upload)
      .props()
      .onChange(files)
    wrapper
      .find(Upload)
      .props()
      .beforeUpload()

    wrapper
      .find(Button)
      .find('.upload-btn')
      .simulate('click')
    expect(initialProps.uploadMiscFiles).toHaveBeenCalledTimes(1)
  })
})
