import React from 'react'
import { shallow } from 'enzyme'
import { Alert, Button } from 'antd'
import { pick } from 'lodash'
import update from 'immutability-helper'
import { LIST_ANALYSIS_TYPE, GET_ANALYSIS_TYPE } from 'store/modules/analyses'
import { LIST_PARAMETER_SET } from 'store/modules/datafiles'
import { Loader } from 'components'
import { AnalysisTypeMock, FileMock, ParameterSetMock, AnalysisMock } from 'test/mocks'
import { AnalysisPredictionSection } from './index'

const initialProps = {
  analysisType: AnalysisTypeMock(1, 1, 'Polyssifier'),
  analysis: AnalysisMock(),
  currentFiles: [FileMock(1, true)],
  options: {
    name: { value: 'Option' },
    parameter_set: { value: 1 },
    parameter: { value: 1 },
  },
  parameterSets: [ParameterSetMock()],
  history: {
    push: jest.fn(),
  },
  match: {
    params: { id: 1 },
  },
  analysesStatus: 'INIT',
  dataFilesStatus: 'INIT',
  groupRun: false,
  initAnalysis: jest.fn(),
  listParameterSet: jest.fn(),
  listAnalysisType: jest.fn(),
  setAnalysisType: jest.fn(),
}

describe('AnalysisPredictionSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisPredictionSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listAnalysisType).toHaveBeenCalledTimes(1)
    expect(initialProps.listParameterSet).toHaveBeenCalledTimes(1)
  })

  it('should render loader', () => {
    wrapper.setProps({ analysesStatus: LIST_ANALYSIS_TYPE })
    wrapper.setProps({ analysesStatus: GET_ANALYSIS_TYPE })
    wrapper.setProps({ dataFilesStatus: LIST_PARAMETER_SET })

    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render only error alert', () => {
    wrapper.setProps({ currentFiles: [] })
    wrapper.setProps({ currentFiles: [{ id: null, name: 'file 1' }] })
    wrapper.setProps({ analysisType: { id: 1, label: 'dFNC' } })

    let props = update(initialProps, {
      options: {
        name: {
          value: { $set: null },
        },
      },
    })
    wrapper.setProps(props)

    props = update(initialProps, {
      options: {
        parameter_set: {
          value: { $set: null },
        },
      },
    })
    wrapper.setProps(props)

    props = update(initialProps, {
      parameterSets: { $set: [] },
    })
    wrapper.setProps(props)

    props = update(initialProps, {
      analysisType: { label: { $set: 'Polyssifier' } },
      currentFiles: { 0: { name: { $set: 'test.nii' } } },
    })
    wrapper.setProps(props)

    expect(wrapper.find(Alert).length).toBe(1)

    wrapper.find(Button).simulate('click')
    expect(initialProps.setAnalysisType).toHaveBeenCalledTimes(0)
    expect(initialProps.initAnalysis).toHaveBeenCalledTimes(0)

    wrapper.setProps({ groupRun: true })
    expect(wrapper.find(Button).html()).toContain('Run Group Analysis')
  })

  it('should run analysis', () => {
    wrapper.find(Button).simulate('click')
    expect(initialProps.setAnalysisType).toHaveBeenCalledWith(initialProps.match.params.id, 10)
    expect(initialProps.initAnalysis).toHaveBeenCalledWith(pick(initialProps, ['options', 'history']))
  })

  it('should render without analysis type', () => {
    const props = update(initialProps, {
      analysisType: { $set: null },
      analysis: { $set: null },
      currentFiles: { $set: [] },
    })
    shallow(<AnalysisPredictionSection {...props} />)
  })
})
