import React from 'react'
import { shallow } from 'enzyme'
import { Switch } from 'antd'
import { ModalitiesMock, StudiesMock } from 'test/mocks'
import { DataFilePage } from './index'
import DefaultFileUploadForm from 'containers/Pages/DataFile/DefaultFileUpload'
import MiscFileUpload from './MiscFileUpload'

const initialProps = {
  modalities: ModalitiesMock(),
  studies: StudiesMock(),
  status: 'INIT',
  dataFileStatus: 'INIT',
  history: {
    goBack: jest.fn(),
  },
  uploadFiles: jest.fn(),
  listMiscFile: jest.fn(),
}

describe('DataFilePage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DataFilePage {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listMiscFile).toHaveBeenCalledTimes(1)
    expect(wrapper.find(DefaultFileUploadForm).length).toBe(1)
    expect(wrapper.find(Switch).length).toBe(1)
  })

  it('Switch defaultDataFile to miscFile', () => {
    const switchUploadFile = wrapper.find(Switch)
    switchUploadFile.simulate('change', { target: { checked: true } })

    expect(wrapper.find(MiscFileUpload).length).toBe(1)
  })
})
