import React from 'react'
import { mount } from 'enzyme'
import { Button, Input, Select } from 'antd'
import { getInputValue, updateFormValues } from 'test/helpers'
import { StudyMock, SitesMock, UserMock } from 'test/mocks'
import StudyForm from '../StudyForm'

const initialProps = {
  submitting: false,
  user: UserMock(),
  sites: SitesMock(3),
  study: StudyMock(1),
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('StudyForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<StudyForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Input).length).toBe(2)
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Select).length).toBe(2)
  })

  it('should change site', () => {
    const siteSelect = wrapper.find(Select).first()
    const site = 1
    siteSelect.props().onChange(site)
  })

  it('should not render site select', () => {
    wrapper.setProps({ sites: [] })
    expect(wrapper.find(Select).length).toBe(0)
  })

  it('should handle form submit', () => {
    const formData = {
      full_name: 'full_name',
      label: 'label',
    }
    updateFormValues(wrapper, formData)
    wrapper.find(Select).forEach(select => select.props().onChange(1))
    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith({
      id: initialProps.study.id,
      data: { ...formData, site: 1, principal_investigator: 1 },
    })

    wrapper.setProps({ study: null })
  })

  it('should show form error', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ onbSubmit: mockFn })
    wrapper.find('form').simulate('submit')
    expect(mockFn).toHaveBeenCalledTimes(0)
  })

  it('should show form with no data', () => {
    const props = { ...initialProps, study: null }
    wrapper = mount(<StudyForm {...props} />)
    expect(getInputValue(wrapper.find('input[id="full_name"]'))).toBe('')
  })
})
