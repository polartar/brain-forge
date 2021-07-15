import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'antd'
import VBMResult from '../VBMResult'
import OutputFileTree from '../OutputFileTree'

const { Item } = List

const initialProps = {
  data: {
    all_files: ['file1', 'file2'],
    all_subject_figures: [
      [['figure1_1', 'figure1_2'], ['figure2_1', 'figure2_2']],
      [['figure3_1', 'figure3_2'], ['figure4_1', 'figure4_2']],
    ],
    summary: [],
    qa_subjects: ['value1'],
    qa_summary: {},
  },
}

describe('VBMResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<VBMResult {...initialProps} />)
  })

  it('should render component', () => {
    const { data } = initialProps

    expect(wrapper.find(Item).length).toBe(data.qa_subjects.length)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('img').length).toBe(8)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
