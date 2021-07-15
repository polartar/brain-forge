import React from 'react'
import { shallow } from 'enzyme'
import { Form } from 'antd'
import { AnalysisOptionsMock } from 'test/mocks'
import { ASLUploadSection } from './index'
import { DataFileTree } from 'components'

const { Item: FormItem } = Form

const initialProps = {
  analysisOptions: AnalysisOptionsMock('ASL'),
  readOnly: false,
  initAnalysisOptions: jest.fn(),
  setAllFiles: jest.fn(),
  selectAnalysisOptions: jest.fn(),
  setCurrentFiles: jest.fn(),
  setAnalysisOption: jest.fn(),
}

describe('ASLUploadSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ASLUploadSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(2)
  })

  it('should call setAllFiles and setCurrentFiles', () => {
    const dataFileTree = wrapper.find(DataFileTree)
    expect(dataFileTree.length).toBe(2)
    const inputImages = ['file1']
    const structuralImage = ['file2']
    dataFileTree
      .at(0)
      .props()
      .onChange(inputImages)

    expect(initialProps.setAllFiles).toHaveBeenCalled()
    expect(initialProps.setCurrentFiles).toHaveBeenCalled()

    dataFileTree
      .at(1)
      .props()
      .onChange(structuralImage)

    expect(initialProps.setAllFiles).toHaveBeenCalled()
    expect(initialProps.setCurrentFiles).toHaveBeenCalled()
  })
})
