import React from 'react'
import { shallow } from 'enzyme'
import { List } from 'antd'
import { FMRIResult } from 'components'
import OutputFileTree from '../OutputFileTree'

const { Item } = List

const initialProps = {
  data: {
    all_files: ['file1.nii', 'file2.nii'],
    all_subject_figures: [[['1.png'], ['2.png']], [['3.png'], ['4.png']]],
    summary: 'summary',
    qa_summary: 'qa_summary',
    qa_subjects: ['qa1', 'qa2'],
  },
}

describe('FMRIResult', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<FMRIResult {...initialProps} />)
  })

  it('should render component', () => {
    const { data } = initialProps

    expect(wrapper.find(Item).length).toBe(data.qa_subjects.length)
    expect(wrapper.find(OutputFileTree).length).toBe(1)
    expect(wrapper.find('img').length).toBe(4)
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
