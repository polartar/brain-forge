import React from 'react'
import { shallow } from 'enzyme'
import { LIST_UPLOADABLE_STUDY } from 'store/modules/sites'
import { DataFileTree, Loader } from 'components'
import { AnalysisTypeMock, FilesMock, StudiesMock } from 'test/mocks'
import { DefaultUploadSection } from './DefaultUpload'

const initialProps = {
  analysis: null,
  allFiles: FilesMock(3),
  currentFiles: FilesMock(2),
  studies: StudiesMock(3),
  status: 'INIT',
  sitesStatus: 'INIT',
  analysisType: AnalysisTypeMock(1, 1, 'Group ICA'),
  showSelector: true,
  listUploadableStudy: jest.fn(),
  setCurrentFiles: jest.fn(),
}

describe('DefaultUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DefaultUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(DataFileTree).length).toBe(1)
  })

  it('should show loader', () => {
    wrapper.setProps({ sitesStatus: LIST_UPLOADABLE_STUDY })

    expect(wrapper.find(Loader).length).toBe(1)
  })
})
