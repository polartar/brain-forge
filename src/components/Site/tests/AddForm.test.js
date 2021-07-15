import React from 'react'
import { mount } from 'enzyme'
import { Button, Input } from 'antd'
import { changeInputValue } from 'test/helpers'
import SiteAddForm from '../AddForm'

const initialProps = {
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('SiteAddForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SiteAddForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Input).length).toBe(2)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should handle form submit', () => {
    changeInputValue(wrapper.find(Input).first(), 'Site name')
    changeInputValue(wrapper.find(Input).last(), 'Site label')
    wrapper.find('form').simulate('submit')
  })

  it('should show form error', () => {
    wrapper.find('form').simulate('submit')
  })
})
