import React from 'react'
import { mount } from 'enzyme'

import { Button } from 'antd'

import { CLIDownloadPage } from './index'

describe('CLIDownloadPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<CLIDownloadPage />)
  })

  it('should render component', () => {
    expect(wrapper.find('li').length).toBe(5)
    expect(wrapper.find(Button).length).toBe(1)
  })
})
