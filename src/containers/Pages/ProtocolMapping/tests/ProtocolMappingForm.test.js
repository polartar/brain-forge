import React from 'react'
import update from 'immutability-helper'
import { mount } from 'enzyme'
import { Button, Select } from 'antd'
import { ModalitiesMock, ProtocolsMock, StudiesMock } from 'test/mocks'
import ProtocolMappingForm from '../ProtocolMappingForm'

const initialProps = {
  initialValues: null,
  studies: StudiesMock(),
  protocols: ProtocolsMock(),
  modalities: ModalitiesMock(),
  submitting: false,
  onSubmit: jest.fn(),
  onDelete: jest.fn(),
  onCancel: jest.fn(),
}

describe('ProtocolMappingForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<ProtocolMappingForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Select).length).toBe(3)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should set initial values', () => {
    const props = update(initialProps, {
      initialValues: {
        $set: {
          study: { id: 1 },
          protocol: { id: 1 },
          modalities: [{ id: 1, name: 'fMRI' }, { id: 2, name: 'sMRI' }],
        },
      },
    })

    wrapper = mount(<ProtocolMappingForm {...props} />)

    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')
  })

  it('should submit form values', () => {
    wrapper
      .find(Select)
      .first()
      .props()
      .onChange(initialProps.studies[0].id)
    wrapper
      .find(Select)
      .at(1)
      .props()
      .onChange(initialProps.protocols[0].id)
    wrapper
      .find(Select)
      .last()
      .props()
      .onChange(initialProps.modalities[0].id)

    wrapper.find('form').simulate('submit')
  })
})
