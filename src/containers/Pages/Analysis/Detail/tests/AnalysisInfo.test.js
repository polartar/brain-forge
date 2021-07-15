import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Button, Descriptions } from 'antd'
import { DELETE_ANALYSIS } from 'store/modules/analyses'
import { successAction } from 'utils/state-helpers'
import { AnalysisMock, AllAnalysisTypesMock, ModalitiesMock } from 'test/mocks'
import { AnalysisInfo } from '../AnalysisInfo'
import { ParamView, FilesView, ProvenanceView } from 'components'

const { Item } = Descriptions

const initialProps = {
  analysis: AnalysisMock({ status: 'Complete', save_path: '/test' }),
  analysisTypes: AllAnalysisTypesMock(),
  history: {
    push: jest.fn(),
  },
  status: 'INIT',
  deleteAnalysis: jest.fn(),
}

describe('AnalysisInfo', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisInfo {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Item).length).toBe(17)

    wrapper.setProps({ status: successAction(DELETE_ANALYSIS) })

    expect(initialProps.history.push).toHaveBeenCalledWith('/study')
  })

  it('should toggle modals', () => {
    wrapper.setProps({
      analysis: {
        ...initialProps.analysis,
        provenance: 'Provenance',
      },
    })

    wrapper.find('.param-modal-btn').simulate('click')
    expect(wrapper.find(ParamView).length).toBe(1)

    wrapper.find('.files-modal-btn').simulate('click')
    expect(wrapper.find(FilesView).length).toBe(1)

    wrapper.find('.provenance-modal-btn').simulate('click')
    expect(wrapper.find(ProvenanceView).length).toBe(1)
  })

  it('should redirect to result page', () => {
    wrapper.setProps({
      analysis: {
        ...initialProps.analysis,
        status: 'Complete',
        has_figures: true,
        date_time_start: '2019-07-01',
        date_time_end: '2019-07-02',
        parameters: {
          analysis: {
            analysis_type: 1,
          },
        },
      },
    })
    expect(wrapper.find(Button).length).toBe(6)

    wrapper.find('.delete-btn').simulate('click')

    wrapper.find('.download-btn').simulate('click')
  })

  it('should render error button', () => {
    wrapper.setProps({
      analysis: {
        ...initialProps.analysis,
        status: 'Error',
        error: 'Error',
      },
    })

    wrapper.find('.error-btn').simulate('click')
  })

  it('should render modalites', () => {
    let props = update(initialProps, {
      analysis: {
        input_file: {
          series: {
            modality: { $set: null },
            protocol: { modalities: { $set: ModalitiesMock() } },
          },
        },
      },
    })

    wrapper.setProps(props)

    props = update(props, {
      analysis: {
        input_file: {
          series: {
            protocol: { modalities: { $set: [] } },
          },
        },
      },
    })

    wrapper.setProps(props)
  })
})
