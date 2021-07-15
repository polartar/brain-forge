import React from 'react'
import { mount } from 'enzyme'
import FilesView from './index'

const initialProps = {
  dataFiles: [
    {
      path: '/home/dev',
      files: ['test.nii', 'test.csv'],
    },
    {
      path: '/home/dev',
      files: ['class.nii', 'class.json', 'class.csv'],
    },
  ],
}

describe('FilesView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<FilesView {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find('tbody tr').length).toBe(4)
  })
})
