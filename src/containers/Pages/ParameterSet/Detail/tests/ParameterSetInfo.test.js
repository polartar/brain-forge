import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'
import { ParameterSetForm } from 'components'
import { UserMock, AllAnalysisTypesMock, ParameterSetMock } from 'test/mocks'
import { UPDATE_PARAMETER_SET } from 'store/modules/datafiles'
import { successAction } from 'utils/state-helpers'
import ParameterSetInfo from '../ParameterSetInfo'

const initialProps = {
  analysisTypes: AllAnalysisTypesMock(),
  parameterSet: ParameterSetMock(),
  user: UserMock(),
  editable: true,
  status: 'INIT',
  updateParameterSet: jest.fn(),
}

describe('ParameterSetInfo', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ParameterSetInfo {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(ParameterSetForm).length).toBe(1)
  })

  it('should populate state', () => {
    wrapper.setProps({ parameterSet: ParameterSetMock(2) })
    wrapper.setProps({ status: successAction(UPDATE_PARAMETER_SET) })
    wrapper.find(Button).simulate('click')
  })
})
