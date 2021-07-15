import React from 'react'
import { shallow } from 'enzyme'
import { Table } from 'antd'
import { Select } from 'components'
import { ModalitiesMock, ProtocolDataMock } from 'test/mocks'
import { AnalysisPlanPage } from './index'

const initialProps = {
  protocolData: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: ProtocolDataMock(),
  },
  location: {
    search: '?study=2',
  },
  modalities: ModalitiesMock(),
  status: 'INIT',
  listProtocolData: jest.fn(),
  clearProtocolData: jest.fn(),
  listParameterSet: jest.fn(),
}

describe('AnalysisPlanPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisPlanPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
    expect(wrapper.find(Select).length).toBe(3)
  })

  it('should trigger select change', () => {
    const selects = wrapper.find(Select)
    selects.forEach(select => {
      select.props().onChange('value')
    })
  })

  it('should change page', () => {
    wrapper.setProps({
      protocolData: {
        ...initialProps.protocolData,
        pageSize: 2,
      },
    })
    wrapper.instance().handleTableChange({ current: 2, pageSize: 2, total: 4 })
  })
})
