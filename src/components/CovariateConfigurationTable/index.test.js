import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Table } from 'antd'
import { FileMock } from 'test/mocks'
import CovariateConfigurationTable from './index'

const initialProps = {
  file: FileMock(1, true),
  toggleAllCurrentFilesField: jest.fn(),
  updateCurrentFilesField: jest.fn(),
}

describe('CovariateConfigurationTable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<CovariateConfigurationTable {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should change variables', () => {
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    wrapper.find(Button).forEach(button => button.simulate('click'))
  })

  it('should change fields', () => {
    wrapper = shallow(<CovariateConfigurationTable {...initialProps} />)
    wrapper.instance().handleToggleAll(true)

    expect(initialProps.toggleAllCurrentFilesField(true))

    const record = { key: 'c1' }
    const selected = true

    wrapper.instance().handleSelect(record, true)
    expect(initialProps.updateCurrentFilesField({ index: record.key, field: { selected } }))
  })

  it('should render nothing', () => {
    wrapper.setProps({ file: { ...initialProps, fields: [] } })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
