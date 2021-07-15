import React from 'react'
import { shallow } from 'enzyme'

import { Form } from 'antd'
import { AnalysisOptionsMock, StudiesMock } from 'test/mocks'
import { MiscFileTree } from 'components'

import { MetadataEditor } from './index'

const { Item: FormItem } = Form

const initialProps = {
  analysisOptions: AnalysisOptionsMock('GICA'),
  studies: StudiesMock(3),
  readOnly: false,
  metadata: '',
  getMetadata: jest.fn(),
  setAnalysisOption: jest.fn(),
  onSortDataTree: jest.fn(),
}

describe('MetadataEditor', () => {
  it('should render components', () => {
    const wrapper = shallow(<MetadataEditor {...initialProps} />)
    expect(wrapper.find(FormItem).length).toBe(1)
    expect(wrapper.find(MiscFileTree).length).toBe(1)
  })
})
