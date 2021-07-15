import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'components'
import { AllAnalysisTypesMock, UserMock, ParameterSetsMock } from 'test/mocks'
import { ParameterSetListPage } from '../index'
import ParameterSetTable from '../ParameterSetTable'

const initialProps = {
  user: UserMock(),
  analysisTypes: AllAnalysisTypesMock(),
  parameterSets: ParameterSetsMock(),
  status: 'INIT',
  listParameterSet: jest.fn(),
  createParameterSet: jest.fn(),
  deleteParameterSet: jest.fn(),
}

describe('ParameterSetListPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ParameterSetListPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listParameterSet).toHaveBeenCalledWith({ params: { shared: 'off' } })
    expect(wrapper.find(ParameterSetTable).length).toBe(2)
  })

  it('should trigger only one table', () => {
    wrapper.setProps({ user: { ...initialProps, is_superuser: true } })
    expect(wrapper.find(ParameterSetTable).length).toBe(1)
  })

  it('should trigger tab change', () => {
    const tabs = wrapper.find(Tabs)
    tabs.props().onChange('mine')
    tabs.props().onChange('shared')
    expect(initialProps.listParameterSet).toHaveBeenCalledWith({ params: { shared: 'on' } })
  })
})
