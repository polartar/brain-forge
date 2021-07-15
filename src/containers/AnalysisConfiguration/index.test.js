import React from 'react'
import { shallow } from 'enzyme'
import update from 'immutability-helper'
import { Form, Input, Checkbox } from 'antd'
import { last } from 'lodash'
import { GET_ANALYSIS_TYPE } from 'store/modules/analyses'
import { CREATE_PARAMETER_SET, UPDATE_PARAMETER_SET } from 'store/modules/datafiles'
import { CovariateConfigurationTable, Loader, ParameterSetForm, Select, VariableConfigurationTable } from 'components'
import { successAction } from 'utils/state-helpers'
import { AnalysisMock, AnalysisOptionsMock, AnalysisTypeMock, FileMock, ParameterSetsMock, UserMock } from 'test/mocks'
import { AnalysisConfiguration } from './index'

const { Item: FormItem } = Form

const initialProps = {
  analysis: AnalysisMock(),
  analysisOptions: AnalysisOptionsMock('Regression'),
  analysisType: AnalysisTypeMock(1, 1, 'Regression'),
  analysesStatus: 'INIT',
  currentFiles: [FileMock()],
  parameterSets: ParameterSetsMock(),
  dataFilesStatus: 'INIT',
  user: UserMock(),
  isDesktop: true,
  history: {
    push: jest.fn(),
  },
  initAnalysisOptions: jest.fn(),
  setAnalysisOption: jest.fn(),
  setAnalysisLocation: jest.fn(),
  toggleAllCurrentFilesField: jest.fn(),
  updateCurrentFilesField: jest.fn(),
}

describe('AnalysisConfiguration', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisConfiguration {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Input).length).toBe(2)
    expect(wrapper.find(Select).length).toBe(2)
    expect(wrapper.find(VariableConfigurationTable).length).toBe(1)
    expect(initialProps.initAnalysisOptions).toHaveBeenCalledTimes(1)
  })

  it('should trigger form change', () => {
    const nameInput = wrapper.find(Input).first()
    nameInput.simulate('change', { target: { value: 'name' } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'name', option: { value: 'name' } })

    const descInput = wrapper.find(Input).last()
    descInput.simulate('change', { target: { value: 'description' } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'description',
      option: { value: 'description' },
    })

    const groupCheckbox = wrapper.find(Checkbox)
    groupCheckbox.simulate('change', { target: { checked: true } })
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({
      name: 'group_analysis',
      option: { value: true },
    })

    const slurmPartitionSelect = wrapper.find(Select).first()
    slurmPartitionSelect.props().onChange('qTRDBF')
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'slurm_partition', option: { value: 'qTRDBF' } })


    const parameterSetSelect = wrapper.find(Select).last()
    parameterSetSelect.props().onChange(1)
    expect(initialProps.setAnalysisOption).toHaveBeenCalledWith({ name: 'parameter_set', option: { value: 1 } })

    wrapper.setProps({
      analysisType: { ...initialProps.analysisType, label: 'dFNC' },
      currentFiles: [{ files: ['test.csv'] }],
    })
    expect(wrapper.find(VariableConfigurationTable).length).toBe(0)
  })

  it('should render loader', () => {
    wrapper.setProps({ analysesStatus: GET_ANALYSIS_TYPE })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ analysisType: null })
    expect(wrapper.find(FormItem).length).toBe(0)
  })

  it('should not show variable configuration table', () => {
    wrapper.setProps({ analysisType: { ...initialProps.analysisType, label: 'VBM' } })
    expect(wrapper.find(VariableConfigurationTable).length).toBe(0)

    wrapper.setProps({ analysisType: { ...initialProps.analysisType, label: 'fMRI' } })
    expect(wrapper.find(VariableConfigurationTable).length).toBe(0)

    wrapper.setProps({
      analysisType: { ...initialProps.analysisType, label: 'GICA' },
      currentFiles: [{ files: ['test.nii'] }],
    })
    expect(wrapper.find(VariableConfigurationTable).length).toBe(0)
  })

  it('should show create parameter button', () => {
    const button = wrapper.find('.create-parameter-set-btn')
    button.simulate('click')

    expect(wrapper.find(ParameterSetForm).length).toBe(1)

    wrapper
      .find(ParameterSetForm)
      .props()
      .onCancel()
    expect(wrapper.state().parameterSet).toBeNull()

    button.simulate('click')
    expect(wrapper.state().parameterSet).not.toBeNull()

    wrapper.setProps({ dataFilesStatus: successAction(CREATE_PARAMETER_SET) })
    expect(wrapper.state().parameterSet).toBeNull()

    wrapper.setProps({ parameterSets: [] })
  })

  it('should set analysis options', () => {
    const props = { ...initialProps, initAnalysisOptions: jest.fn(), analysis: null }
    wrapper = shallow(<AnalysisConfiguration {...props} />)

    expect(props.initAnalysisOptions).toHaveBeenCalledTimes(0)
  })

  it('should show covariate configuration table', () => {
    wrapper.setProps({
      analysisOptions: AnalysisOptionsMock('MANCOVA'),
      analysisType: AnalysisTypeMock(1, 1, 'MANCOVA'),
    })

    expect(wrapper.find(CovariateConfigurationTable).length).toBe(1)
  })

  it('should edit parameter set', () => {
    const props = update(initialProps, {
      isDesktop: { $set: false },
      analysisOptions: {
        parameter_set: { $set: { value: 1 } },
      },
    })

    wrapper.setProps(props)
    wrapper.find('.edit-parameter-set-btn').simulate('click')

    expect(wrapper.find(ParameterSetForm).length).toBe(1)

    wrapper
      .find(Select)
      .last()
      .props()
      .onChange(last(initialProps.parameterSets).id)

    wrapper.setProps({ dataFilesStatus: successAction(UPDATE_PARAMETER_SET) })

    expect(wrapper.state().parameterSet).toBeNull()
  })
})
