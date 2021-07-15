import React from 'react'
import { shallow } from 'enzyme'
import { LIST_USER, GET_PROFILE } from 'store/modules/auth'
import { GET_PARAMETER_SET } from 'store/modules/datafiles'
import { Loader } from 'components'
import { UserMock, UsersMock, AllAnalysisTypesMock, ParameterSetMock } from 'test/mocks'
import { ParameterSetDetailPage } from '../index'

const initialProps = {
  user: UserMock(),
  users: UsersMock(3),
  analysisTypes: AllAnalysisTypesMock(),
  parameterSet: ParameterSetMock(),
  match: {
    params: { parameterSetId: 1 },
  },
  status: 'INIT',
  authStatus: 'INIT',
  listUser: jest.fn(),
  getProfile: jest.fn(),
  getParameterSet: jest.fn(),
  createParameter: jest.fn(),
  updateParameter: jest.fn(),
  deleteParameter: jest.fn(),
}

describe('ParameterSetDetailPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ParameterSetDetailPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listUser).toHaveBeenCalledTimes(1)
    expect(initialProps.getParameterSet).toHaveBeenCalledWith(initialProps.match.params.parameterSetId)
    expect(initialProps.getProfile).toHaveBeenCalledTimes(1)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: GET_PARAMETER_SET })
    wrapper.setProps({ status: 'INIT', authStatus: LIST_USER })
    wrapper.setProps({ status: 'INIT', authStatus: GET_PROFILE })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ parameterSet: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
