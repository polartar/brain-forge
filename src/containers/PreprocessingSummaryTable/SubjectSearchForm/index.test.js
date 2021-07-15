import React from 'react'
import { mount } from 'enzyme'
import { Button, Form, Select } from 'antd'
import SubjectSearchForm from './index'

const initialProps = {
  studyLabel: 'devcog',
  onSubmit: jest.fn(),
  onToggle: jest.fn(),
}

describe('SubjectSearchForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SubjectSearchForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Select).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Form).props().className).toContain('d-none')

    wrapper.setProps({ visible: true })
    expect(wrapper.find(Form).props().className).not.toContain('d-none')
  })

  it('should submit subject', () => {
    const subject = 'subject-1'
    wrapper
      .find(Select)
      .props()
      .onChange(subject)
    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith(subject)
  })

  it('should reset form', () => {
    wrapper
      .find(Button)
      .last()
      .simulate('click')
    expect(initialProps.onSubmit).toHaveBeenCalledWith(null)
    expect(initialProps.onToggle).toHaveBeenCalledTimes(1)
  })
})
