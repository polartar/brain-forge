import React from 'react'
import { mount } from 'enzyme'
import { Button, Input, Select } from 'antd'
import { AsyncSelect } from 'components'
import { ModalitiesMock, AllAnalysisTypesMock, TagsMock, StudiesMock, ProtocolDataMock } from 'test/mocks'
import SearchFrom from '../SearchForm'

const initialProps = {
  analysisTypes: AllAnalysisTypesMock(),
  modalities: ModalitiesMock(),
  protocols: ProtocolDataMock(),
  studies: StudiesMock(2),
  tags: TagsMock(),
  values: {
    site: '',
    pi: '',
    scanner: '',
    modality: '',
    subject: '',
    user: '',
    session: '',
    status: '',
    study: '',
    protocol: '',
  },
  isMobile: false,
  onChange: jest.fn(),
  onReset: jest.fn(),
  onSubmit: jest.fn(),
}

describe('SearchForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SearchFrom {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(3)
    expect(wrapper.find(Select).length).toBe(7)

    wrapper.setProps({ isMobile: true })
  })

  it('should reset form', () => {
    wrapper
      .find(Button)
      .last()
      .simulate('click')
    expect(initialProps.onReset).toHaveBeenCalledTimes(1)
  })

  it('should show advanced form', () => {
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    expect(wrapper.find(Select).length).toBe(14)
  })

  it('should change form value', () => {
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    wrapper.find(Select).forEach(select => select.props().onChange('1'))
    wrapper.find(AsyncSelect).forEach(asyncSelect => asyncSelect.props().onChange('2'))
    wrapper.find(Input).forEach(input => input.props().onChange({ target: { value: 1 } }))
  })

  it('should update protocols by studies selected', () => {
    //Before: By default, No study is selected, => no protocols
    expect((wrapper.find(Select).at(2).prop('children')).length).toBe(0)

    //Action: Study is selected
    wrapper.setProps({ values : {
      site: '',
      pi: '',
      scanner: '',
      modality: '',
      subject: '',
      user: '',
      session: '',
      status: '',
      study: ['1'],
      protocol: '',
    }})

    // After: 2 protocols display on the protocols list
    expect((wrapper.find(Select).at(2).prop('children')).length).toBe(2)
  })
})
