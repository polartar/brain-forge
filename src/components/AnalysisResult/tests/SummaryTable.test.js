import React from 'react'
import { mount } from 'enzyme'
import { SummaryTableMock } from 'test/mocks'
import SummaryTable from '../SummaryTable'

describe('SummaryTable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<SummaryTable content={SummaryTableMock(4, 5)} />)
  })

  it('should render component', () => {
    const table = wrapper.find('tbody.ant-table-tbody')

    expect(table.find('tr').length).toBe(4)
    expect(table.find('td').length).toBe(4 * 5)
  })

  it('should render nothing', () => {
    wrapper.setProps({ content: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()

    wrapper.setProps({ content: [] })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
