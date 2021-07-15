import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Alert, Button } from 'antd'
import {
  ASLResult,
  DTIResult,
  GiftResult,
  PolyssifierResult,
  RegressionResult,
  VBMResult,
  FMRIResult,
  FMRI32Result,
  FMRIPhantomQAResult,
  FreeSurferResult,
  SPMGLMLevel1Result,
  SPMGLMLevel2Result,
  PapayaViewer,
} from 'components'
import Summary from '../Summary'
import WMHResult from '../WMHResult'

const initialProps = {
  id: 1,
  data: {
    name: 'regression',
    description: 'Regression description',
    has_figures: false,
  },
}

describe('Summary', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<Summary {...initialProps} />)
    wrapper.setState({ token: 'token' })
  })

  it('should render component', () => {
    const { data } = initialProps

    expect(wrapper.html()).toContain(data.name)
    expect(wrapper.html()).toContain(data.description)
    expect(wrapper.find(RegressionResult).length).toBe(1)
    expect(wrapper.find(RegressionResult).prop('data')).toBe(initialProps.data)
    expect(wrapper.find(Button).length).toBe(0)
  })

  it('should render sub result', () => {
    let props = update(initialProps, {
      data: { name: { $set: 'ASL' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(ASLResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'regression' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(RegressionResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'polyssifier' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(PolyssifierResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'groupica' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(GiftResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'vbm' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(VBMResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'fMRIPreproc' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(FMRIResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'fMRI 32-channel' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(FMRI32Result).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'fMRI Phantom QA' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(FMRIPhantomQAResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'Freesurfer' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(FreeSurferResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'SPM-GLM Level 1' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(SPMGLMLevel1Result).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'SPM-GLM Group Level' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(SPMGLMLevel2Result).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'DTI Preprocessing' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(DTIResult).length).toBe(1)

    props = update(initialProps, {
      data: { name: { $set: 'WMH' } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(WMHResult).length).toBe(1)
  })

  it('should show alert', () => {
    const props = update(initialProps, {
      data: { name: { $set: null } },
    })
    wrapper.setProps(props)
    expect(wrapper.find(Alert).length).toBe(1)
    expect(wrapper.find(Alert).prop('type')).toBe('info')
  })

  it('should render nothing', () => {
    wrapper.setProps({ data: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })

  it('should show download button', () => {
    const props = update(initialProps, {
      data: { has_figures: { $set: true } },
    })
    wrapper.setProps(props)

    const button = wrapper.find(Button)

    expect(button.length).toBe(1)
    button.simulate('click')
  })

  it('should render Papaya Viewer', () => {
    const props = update(initialProps, {
      data: { all_files: { $set: ['abc.nii'] } },
    })
    wrapper.setProps(props)
    wrapper.setState({ papayaFile: 'abc.nii' })

    expect(wrapper.find(PapayaViewer).length).toBe(0)
  })
})
