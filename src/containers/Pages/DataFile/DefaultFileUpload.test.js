import React from 'react'
import { mount, shallow } from 'enzyme'
import {
  SitesMock,
  UserMock,
  ModalitiesMock,
  StudiesMock,
  ScannersMock,
  SubjectsMock,
  SessionsMock,
  MultipleSeriesMock,
} from 'test/mocks'
import { Upload } from 'antd'
import { CREATE_STUDY, CREATE_SCANNER, CREATE_SUBJECT, CREATE_SESSION, CREATE_SERIES } from 'store/modules/sites'
import { Drawer, StudyForm, ScannerForm, SubjectForm, SessionForm, SeriesForm, Select } from 'components'
import { UPLOAD_FILES } from 'store/modules/datafiles'
import { successAction } from 'utils/state-helpers'
import { DefaultFileUploadForm } from './DefaultFileUpload'

const initialProps = {
  user: UserMock(),
  status: 'INIT',
  sites: SitesMock(),
  modalities: ModalitiesMock(),
  dataFileStatus: 'INIT',
  studies: StudiesMock(),
  allScanners: ScannersMock(),
  allSubjects: SubjectsMock(),
  allSessions: SessionsMock(),
  allSeries: MultipleSeriesMock(),
  listSite: jest.fn(),
  listStudy: jest.fn(),
  createStudy: jest.fn(),
  listAllScanner: jest.fn(),
  createScanner: jest.fn(),
  listAllSubject: jest.fn(),
  createSubject: jest.fn(),
  listAllSession: jest.fn(),
  createSession: jest.fn(),
  listAllSeries: jest.fn(),
  createSeries: jest.fn(),
  onSubmit: jest.fn(),
}

describe('DefaultFileUpload', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DefaultFileUploadForm {...initialProps} />)
  })

  it('should render component', () => {
    wrapper = mount(<DefaultFileUploadForm {...initialProps} />)
    expect(initialProps.listSite).toHaveBeenCalledTimes(1)
    expect(initialProps.listStudy).toHaveBeenCalledTimes(1)
  })

  it('should close drawers after create', () => {
    wrapper.setProps({ status: successAction(CREATE_STUDY) })
    wrapper.setProps({ status: successAction(CREATE_SCANNER) })
    wrapper.setProps({ status: successAction(CREATE_SUBJECT) })
    wrapper.setProps({ status: successAction(CREATE_SESSION) })
    wrapper.setProps({ status: successAction(CREATE_SERIES) })
    wrapper.setProps({ dataFileStatus: successAction(UPLOAD_FILES) })
  })

  it('should show drawers', () => {
    wrapper.find('.study-add-btn').simulate('click')
    wrapper.find('.scanner-add-btn').simulate('click')
    wrapper.find('.subject-add-btn').simulate('click')
    wrapper.find('.session-add-btn').simulate('click')
    wrapper.find('.series-add-btn').simulate('click')

    wrapper
      .find(StudyForm)
      .props()
      .onCancel()
    wrapper
      .find(ScannerForm)
      .props()
      .onCancel()
    wrapper
      .find(SubjectForm)
      .props()
      .onCancel()
    wrapper
      .find(SessionForm)
      .props()
      .onCancel()
    wrapper
      .find(SeriesForm)
      .props()
      .onCancel()

    wrapper.find(Drawer).forEach(drawer => drawer.props().onClose())
  })

  it('should trigger form value change', () => {
    const files = {
      fileList: [{ originFileObj: 'file' }],
    }

    wrapper.find(Select).forEach(select => select.props().onChange(1))
    wrapper
      .find(Upload)
      .props()
      .onChange(files)
    wrapper
      .find(Upload)
      .props()
      .beforeUpload()

    wrapper.find('.upload-btn').simulate('click')
  })

  it('should submit study from', () => {
    const formData = { full_name: 'Study 1', label: 'study-1', site: 1, principal_investigator: 1 }
    wrapper
      .find(StudyForm)
      .props()
      .onSubmit(formData)
    expect(initialProps.createStudy).toHaveBeenCalledTimes(1)
  })

  it('should submit scanner form', () => {
    const formData = { full_name: 'Scanner 1', label: 'scanner-1' }
    wrapper
      .find(ScannerForm)
      .props()
      .onSubmit(formData)
    expect(initialProps.createScanner).toHaveBeenCalledTimes(1)
  })

  it('should submit subject form', () => {
    const formData = { anon_id: 'anon_id' }
    wrapper
      .find(SubjectForm)
      .props()
      .onSubmit(formData)
    expect(initialProps.createSubject).toHaveBeenCalledTimes(1)
  })

  it('should submit session form', () => {
    const formData = { segment_interval: 'segment_interval', anonymized_scan_date: 'anonymized_scan_date' }
    wrapper
      .find(SessionForm)
      .props()
      .onSubmit(formData)
    expect(initialProps.createSession).toHaveBeenCalledTimes(1)
  })

  it('should submit series form', () => {
    const formData = { label: 'label', study_code_label: 'study_code_label', modality: 1 }
    wrapper
      .find(SeriesForm)
      .props()
      .onSubmit(formData)
    expect(initialProps.createSeries).toHaveBeenCalledTimes(1)
  })

  it('should close drawers after create success', () => {
    const actions = [CREATE_STUDY, CREATE_SCANNER, CREATE_SUBJECT, CREATE_SERIES, CREATE_SERIES]

    actions.forEach((action, idx) => {
      wrapper.setProps({ status: successAction(action) })

      expect(
        wrapper
          .find(Drawer)
          .at(idx)
          .props().visible,
      ).toBe(false)
    })
  })
})
