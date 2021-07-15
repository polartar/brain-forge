import React from 'react'
import { mount, shallow } from 'enzyme'
import { Alert, Drawer, Input, Table } from 'antd'
import { LIST_STUDY } from 'store/modules/sites'
import { UPDATE_PROTOCOL_MAPPING } from 'store/modules/mappings'
import { successAction } from 'utils/state-helpers'
import { ModalitiesMock, ProtocolsMock, StudiesMock, ProtocolMappingsMock } from 'test/mocks'
import ProtocolMappingForm from '../ProtocolMappingForm'
import { ProtocolMappingPage } from '../index'

const initialProps = {
  studies: StudiesMock(),
  protocols: ProtocolsMock(),
  modalities: ModalitiesMock(),
  protocolMappings: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: ProtocolMappingsMock(),
  },
  status: 'INIT',
  listProtocol: jest.fn(),
  listModality: jest.fn(),
  listStudy: jest.fn(),
  listProtocolMapping: jest.fn(),
  createProtocolMapping: jest.fn(),
  updateProtocolMapping: jest.fn(),
  deleteProtocolMapping: jest.fn(),
}

describe('ProtocolMappingPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<ProtocolMappingPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
    expect(initialProps.listStudy).toHaveBeenCalledTimes(1)
    expect(initialProps.listProtocol).toHaveBeenCalledTimes(1)
    expect(initialProps.listModality).toHaveBeenCalledTimes(1)
    expect(initialProps.listProtocolMapping).toHaveBeenCalledTimes(1)
  })

  it('should change table', () => {
    wrapper
      .find('.edit-btn')
      .first()
      .simulate('click')
    expect(wrapper.state().showDrawer).toBeTruthy()

    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')
  })

  it('should toggle drawer', () => {
    const prevShowDrawer = wrapper.state().showDrawer
    const drawer = wrapper.find(Drawer)
    drawer.props().onClose()

    const afterShowDrawer = wrapper.state().showDrawer
    expect(prevShowDrawer !== afterShowDrawer).toBeTruthy()

    drawer.props().onClose()

    wrapper.setProps({ status: UPDATE_PROTOCOL_MAPPING })
    wrapper.setProps({ status: successAction(UPDATE_PROTOCOL_MAPPING) })
    expect(wrapper.state('showDrawer')).toBeFalsy()

    wrapper.setProps({ modalities: [] })
  })

  it('should handle table change', () => {
    const pagination = { current: 1 }
    const filters = {
      study: ['study-1'],
      protocol: ['protocol-1'],
      modalities: ['sMRI', 'fMRI'],
    }
    wrapper
      .find(Table)
      .props()
      .onChange(pagination, filters)

    expect(initialProps.listProtocolMapping).toHaveBeenCalledWith({
      params: {
        page: pagination.current,
        study: filters.study[0],
        protocol: filters.protocol[0],
        modalities: filters.modalities.join(','),
      },
    })

    const input = wrapper.find(Input).first()

    input.props().onChange({ target: { value: null } })
    input.props().onChange({ target: { value: 'study-1' } })
  })

  it('should submit form values', () => {
    wrapper = shallow(<ProtocolMappingPage {...initialProps} />)
    const createPayload = {
      data: {
        study: 1,
        protocol: 1,
        modalities: [1, 2, 3],
      },
    }
    wrapper
      .find(ProtocolMappingForm)
      .props()
      .onSubmit(createPayload)
    expect(initialProps.createProtocolMapping).toHaveBeenCalledWith(createPayload.data)

    const updatePayload = {
      id: 1,
      data: { ...createPayload.data },
    }
    wrapper
      .find(ProtocolMappingForm)
      .props()
      .onSubmit(updatePayload)
    expect(initialProps.updateProtocolMapping).toHaveBeenCalledWith(updatePayload)
  })

  it('should render alert', () => {
    wrapper.setProps({ status: successAction(LIST_STUDY) })
    wrapper.setProps({ studies: [] })

    expect(wrapper.find(Alert).length).toBe(1)
  })
})
