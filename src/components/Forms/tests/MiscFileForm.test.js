import React from 'react'
import { mount, shallow } from 'enzyme'
import { StudiesMock } from 'test/mocks'
import { Button, Form, Upload, Input } from 'antd'

import { Select, Option } from 'components'
import { UPLOAD_MISC_FILES } from 'store/modules/datafiles'
import { MiscFileForm } from '../MiscFileForm'

const { Item: FormItem } = Form

const initialProps = {
  studies: StudiesMock(),
  dataFileStatus: UPLOAD_MISC_FILES,
  listStudy: jest.fn(),
  uploadMiscFiles: jest.fn(),
  listMiscFile: jest.fn(),
  onSubmit: jest.fn(),
}

describe('MiscFileForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<MiscFileForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listStudy).toHaveBeenCalledTimes(1)

    expect(wrapper.find(FormItem).length).toBe(4)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should Upload MiscFile and submit', () => {
    const files = {
      fileList: [{ originFileObj: 'file' }],
    }

    const wrapper = shallow(<MiscFileForm {...initialProps} />)

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

    wrapper.find('.upload-btn').simulate('click')
    expect(initialProps.uploadMiscFiles).toHaveBeenCalledTimes(1)
  })
})
