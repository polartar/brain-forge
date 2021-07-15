import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import {
  OptionEditor,
  RegressionOptionEditor,
  PolyssifierOptionEditor,
  DFNCOptionEditor,
  GroupICAOptionEditor,
  SPMGLMOptionEditor,
  GroupSPMGLMOptionEditor,
  StructuralMRIOptionEditor,
  FunctionalMRIPreprocOptionEditor,
  FMRI32OptionEditor,
  DTIOptionEditor,
  ASLOptionEditor,
  FMRIPhantomQAOptionEditor,
  MancovaOptionEditor,
  WMHOptionEditor,
  VariableConfigurationTable,
} from 'components'
import { AnalysisMock, FileMock } from 'test/mocks'
import ParamView from './index'

const initialProps = {
  analysis: AnalysisMock(),
  label: 'Regression',
  file: FileMock(),
  analyses: {},
}

describe('ParamView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ParamView {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(OptionEditor).length).toBe(1)
    expect(wrapper.find(RegressionOptionEditor).length).toBe(1)
    expect(wrapper.find(VariableConfigurationTable).length).toBe(1)

    wrapper.setProps({ analysis: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('should render sub editors', () => {
    let props = update(initialProps, { label: { $set: 'Regression' } })
    wrapper.setProps(props)
    expect(wrapper.find(RegressionOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'Polyssifier' } })
    wrapper.setProps(props)
    expect(wrapper.find(PolyssifierOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'GICA' } })
    wrapper.setProps(props)
    expect(wrapper.find(GroupICAOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'dFNC' } })
    wrapper.setProps(props)
    expect(wrapper.find(DFNCOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'MANCOVA' } })
    wrapper.setProps(props)
    expect(wrapper.find(MancovaOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'VBM' } })
    wrapper.setProps(props)
    expect(wrapper.find(StructuralMRIOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'fMRI' } })
    wrapper.setProps(props)
    expect(wrapper.find(FunctionalMRIPreprocOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'fMRI_32ch' } })
    wrapper.setProps(props)
    expect(wrapper.find(FMRI32OptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'DTI' } })
    wrapper.setProps(props)
    expect(wrapper.find(DTIOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'SPMGLM' } })
    wrapper.setProps(props)
    expect(wrapper.find(SPMGLMOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'GroupSPMGLM' } })
    wrapper.setProps(props)
    expect(wrapper.find(GroupSPMGLMOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'ASL' } })
    wrapper.setProps(props)
    expect(wrapper.find(ASLOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'fMRI_PhantomQA' } })
    wrapper.setProps(props)
    expect(wrapper.find(FMRIPhantomQAOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: 'WMH' } })
    wrapper.setProps(props)
    expect(wrapper.find(WMHOptionEditor).length).toBe(1)

    props = update(initialProps, { label: { $set: null } })
    wrapper.setProps(props)
  })
})
