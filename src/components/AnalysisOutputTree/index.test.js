import React from 'react'
import { mount } from 'enzyme'
import { TreeSelect } from 'antd'
import { AnalysisTypeMock, AnalysesMock } from 'test/mocks'

import AnalysisOutputTree from './index'

const initialProps = {
  analysisType: AnalysisTypeMock(),
  analyses: AnalysesMock(),
  analysis: null,
  onChange: jest.fn(),
  onUpdateFields: jest.fn(),
}

describe('AnalysisOutputTree', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<AnalysisOutputTree {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TreeSelect).length).toBe(1)
  })
})
