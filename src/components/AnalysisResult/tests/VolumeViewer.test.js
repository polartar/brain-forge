import React from 'react'
import { shallow } from 'enzyme'
import { TreeSelect } from 'antd'
import update from 'immutability-helper'
import { PapayaViewer } from 'components'
import VolumeViewer from '../VolumeViewer'

const initialProps = {
  data: {
    name: 'vbm',
    description: 'VBM',
    has_figures: false,
    all_files: ['test.nii'],
  },
}

describe('PapayaViewer', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<VolumeViewer {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TreeSelect).length).toBe(1)
  })

  it('should show papaya viewer', () => {
    wrapper
      .find(TreeSelect)
      .props()
      .onChange(initialProps.data.all_files[0])

    expect(wrapper.find(PapayaViewer).length).toBe(1)

    const props = update(initialProps, { data: { all_files: { $set: [] } } })
    wrapper = shallow(<VolumeViewer {...props} />)

    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
