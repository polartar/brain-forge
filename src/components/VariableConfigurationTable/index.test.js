import React from 'react'
import { mount } from 'enzyme'
import { Button, Table } from 'antd'
import { FileMock } from 'test/mocks'
import VariableConfigurationTable from './index'

const initialProps = {
  analysis: {},
  file: FileMock(),
  className: 'mb-2',
  readOnly: false,
  toggleAllCurrentFilesField: jest.fn(),
  updateCurrentFilesField: jest.fn(),
}

describe('VariableConfigurationTable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<VariableConfigurationTable {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should trigger toggle all', () => {
    const selectAll = wrapper.find('thead').find('input[type="checkbox"]')
    selectAll.simulate('change', { target: { value: true } })
    expect(initialProps.toggleAllCurrentFilesField).toHaveBeenCalledTimes(1)
  })

  it('should trigger select', () => {
    const select = wrapper
      .find('tbody')
      .find('input[type="checkbox"]')
      .first()
    select.simulate('change', { target: { value: true } })
    expect(initialProps.updateCurrentFilesField).toHaveBeenCalledTimes(1)
  })

  it('should trigger variable change', () => {
    const props = { ...initialProps, updateCurrentFilesField: jest.fn() }
    wrapper.setProps(props)

    const buttons = wrapper
      .find('tbody tr')
      .first()
      .find(Button)

    buttons.forEach(button => {
      button.simulate('click')
    })

    expect(props.updateCurrentFilesField).toHaveBeenCalledTimes(buttons.length)
  })

  it('should render empty component', () => {
    wrapper.setProps({ analysis: {}, file: {} })

    expect(wrapper.find(Table).length).toBe(0)
  })
})
