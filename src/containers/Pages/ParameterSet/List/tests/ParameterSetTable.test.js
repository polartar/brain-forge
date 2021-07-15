import React from 'react'
import update from 'immutability-helper'
import { shallow, mount } from 'enzyme'
import { BrowserRouter as Router } from 'react-router-dom'
import { Button, Empty, Table } from 'antd'
import { AllAnalysisTypesMock, UserMock, ParameterSetsMock } from 'test/mocks'
import { ParameterSetForm } from 'components'
import { CREATE_PARAMETER_SET } from 'store/modules/datafiles'
import { changeInputValue } from 'test/helpers'
import { successAction } from 'utils/state-helpers'
import { ParameterSetTable } from '../ParameterSetTable'

const initialProps = {
  analysisTypes: AllAnalysisTypesMock(),
  parameterSets: ParameterSetsMock(),
  shared: false,
  user: UserMock(),
  title: 'Parameter 1',
  analysisLocation: '/analysis-start/1',
  history: {
    push: jest.fn(),
  },
  status: 'INIT',
  isDesktop: true,
  isMobile: false,
  deleteParameterSet: jest.fn(),
  setAnalysisLocation: jest.fn(),
}

describe('ParameterSetTable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ParameterSetTable {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)

    wrapper.setProps({ isDesktop: false, isMobile: true })
  })

  it('should render empty', () => {
    wrapper.setProps({ parameterSets: [], shared: true })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should not render buttons', () => {
    wrapper.setProps({ shared: true })
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should trigger delete parameter set', () => {
    const props = update(initialProps, {
      parameterSets: { 0: { shared_users: { $set: [] } } },
    })
    wrapper = mount(
      <Router>
        <ParameterSetTable {...props} />
      </Router>,
    )
    const button = wrapper.find('.delete-btn').first()
    button.simulate('click')
  })

  it('should add parameter set', () => {
    wrapper.instance().handleAnalysisSelect({ key: 'VBM' })
    wrapper
      .find(ParameterSetForm)
      .props()
      .onCancel()
    wrapper.setProps({ status: successAction(CREATE_PARAMETER_SET) })

    expect(initialProps.history.push).toHaveBeenCalledWith(initialProps.analysisLocation)
    expect(initialProps.setAnalysisLocation).toHaveBeenCalledTimes(1)
  })

  it('should not redirect to analysis page', () => {
    const props = update(initialProps, {
      status: { $set: successAction(CREATE_PARAMETER_SET) },
      analysisLocation: { $set: null },
      setAnalysisLocation: { $set: jest.fn() },
    })
    wrapper.setProps(props)

    expect(props.setAnalysisLocation).toHaveBeenCalledTimes(0)
  })

  it('should filter parameter sets', () => {
    wrapper = mount(
      <Router>
        <ParameterSetTable {...initialProps} />
      </Router>,
    )
    wrapper
      .find('.anticon-search')
      .first()
      .simulate('click')
    changeInputValue(wrapper.find('.ant-table-filter-dropdown input').first(), '1')
    wrapper.find('.ant-table-filter-dropdown .ant-btn-primary').simulate('click')
    expect(wrapper.find('tbody tr').length).toBe(1)

    wrapper
      .find('.anticon-filter')
      .first()
      .simulate('click')
    wrapper
      .find('.ant-dropdown-menu-item')
      .last()
      .simulate('click')
    wrapper.find('.ant-table-filter-dropdown-link.confirm').simulate('click')
    expect(wrapper.find('tbody tr').length).toBe(0)
  })
})
