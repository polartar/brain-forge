import React from 'react'
import { mount } from 'enzyme'
import { Button, Input, Select } from 'antd'
import { ModalitiesMock, ProtocolMappingsMock } from 'test/mocks'
import { changeInputValue } from 'test/helpers'
import SeriesForm from '../SeriesForm'

const initialProps = {
  modalities: ModalitiesMock(),
  mappings: ProtocolMappingsMock(),
  submitting: false,
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
}

describe('SeriesForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SeriesForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(2)
    expect(wrapper.find(Input).length).toBe(2)
    expect(wrapper.find(Select).length).toBe(2)
  })

  it('should handle create', () => {
    const formData = {
      label: 'label',
      study_code_label: 'study_code_label',
      modality: initialProps.modalities[1].id,
      protocol: initialProps.mappings[0].protocol.id,
    }

    changeInputValue(wrapper.find(Input).first(), formData.label)
    changeInputValue(wrapper.find(Input).at(1), formData.study_code_label)
    wrapper
      .find(Select)
      .first()
      .props()
      .onChange(formData.modality)
    wrapper
      .find(Select)
      .last()
      .props()
      .onChange(formData.protocol)

    wrapper.find('form').simulate('submit')

    expect(initialProps.onSubmit).toHaveBeenCalledWith({ data: formData })
  })

  it('should generate form submit error', () => {
    const mockFn = jest.fn()
    wrapper.setProps({ onSubmit: mockFn })

    changeInputValue(wrapper.find(Input).first(), 'label')
    wrapper.find('form').simulate('submit')

    expect(mockFn).toHaveBeenCalledTimes(0)
  })
})
