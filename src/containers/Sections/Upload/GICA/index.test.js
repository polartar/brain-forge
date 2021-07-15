import React from 'react'
import { shallow } from 'enzyme'

import { Form } from 'antd'
import { AnalysisMock, StudiesMock } from 'test/mocks'
import { GroupICAUploadSection } from './index'

import { DataFileTree, MetadataEditor } from 'components'

const { Item: FormItem } = Form

const initialProps = {
  analysis: AnalysisMock(),
  studies: StudiesMock(3),
  sitesStatus: '',
  analysisType: {},
  showSelector: true,
  listUploadableStudy: jest.fn(),
  setAllFiles: jest.fn(),
  setCurrentFiles: jest.fn(),
  updateCurrentFileFields: jest.fn(),
  initializeCurrentFiles: jest.fn(),
}

describe('GroupICAUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<GroupICAUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(1)
    expect(wrapper.find(MetadataEditor).length).toBe(1)
    expect(wrapper.find(DataFileTree).length).toBe(1)
  })

})
