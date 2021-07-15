import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { ParameterSetMock, UserMock, AllAnalysisTypesMock } from 'test/mocks'
import { OptionEditor, Loader } from 'components'
import { Button, Checkbox, Input } from 'antd'
import { changeInputValue } from 'test/helpers'
import { ParameterSetForm } from '../ParameterSetForm'

const initialProps = {
  parameterSet: ParameterSetMock(1, 1, 'Regression'),
  submitting: false,
  user: UserMock(),
  analysisTypes: AllAnalysisTypesMock(),
  createParameterSet: jest.fn(),
  updateParameterSet: jest.fn(),
  onCancel: jest.fn(),
}

describe('ParameterSetForm', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ParameterSetForm {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(OptionEditor).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(2)
  })

  it('should render loader', () => {
    wrapper.setProps({ submitting: true })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render sub editors', () => {
    wrapper.setProps({ parameterSet: ParameterSetMock(1, 1, 'Regression') })
    wrapper.setProps({ parameterSet: ParameterSetMock(2, 2, 'Polyssifier') })
    wrapper.setProps({ parameterSet: ParameterSetMock(3, 3, 'GICA') })
    wrapper.setProps({ parameterSet: ParameterSetMock(4, 4, 'dFNC') })
    wrapper.setProps({ parameterSet: ParameterSetMock(5, 5, 'VBM') })
    wrapper.setProps({ parameterSet: ParameterSetMock(6, 6, 'fMRI') })
    wrapper.setProps({ parameterSet: ParameterSetMock(7, 7, 'DTI') })
    wrapper.setProps({ parameterSet: ParameterSetMock(8, 8, 'Freesurfer') })
    wrapper.setProps({ parameterSet: ParameterSetMock(9, 9, 'DKI') })
    wrapper.setProps({ parameterSet: ParameterSetMock(10, 10, 'SPMGLM') })
    wrapper.setProps({ parameterSet: ParameterSetMock(11, 11, 'GroupSPMGLM') })
    wrapper.setProps({ parameterSet: ParameterSetMock(12, 12, 'fMRI_32ch') })
    wrapper.setProps({ parameterSet: ParameterSetMock(13, 13, 'MANCOVA') })
    wrapper.setProps({ parameterSet: ParameterSetMock(14, 14, 'ASL') })
    wrapper.setProps({ parameterSet: ParameterSetMock(15, 15, 'fMRI_PhantomQA') })
    wrapper.setProps({ parameterSet: ParameterSetMock(16, 16, 'WMH') })
  })

  it('should set custom', () => {
    const props = update(initialProps, {
      user: {
        is_superuser: {
          $set: true,
        },
      },
    })
    wrapper.setProps(props)
    wrapper
      .find(Checkbox)
      .props()
      .onChange({ target: { checked: true } })
  })

  it('should submit form', () => {
    changeInputValue(wrapper.find(Input).first(), 1)
    let props = update(initialProps, {
      parameterSet: {
        id: {
          $set: null,
        },
      },
    })
    wrapper.setProps(props)
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    props = update(initialProps, {
      parameterSet: {
        id: {
          $set: 1,
        },
      },
    })
    wrapper.setProps(props)
    wrapper
      .find(Button)
      .first()
      .simulate('click')
  })

  it('should show error', () => {
    let props = update(initialProps, {
      parameterSet: {
        options: {
          name: {
            value: { $set: null },
          },
        },
      },
    })
    wrapper.setProps(props)
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    props = update(initialProps, {
      parameterSet: {
        version: {
          $set: null,
        },
      },
    })
    wrapper.setProps(props)
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    props = update(initialProps, {
      parameterSet: {
        $set: ParameterSetMock(2, 2, 'Polyssifier'),
      },
    })
    props = update(props, {
      parameterSet: {
        options: {
          include: {
            value: {
              $set: [],
            },
          },
        },
      },
    })
    wrapper.setProps(props)
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    props = update(initialProps, {
      parameterSet: {
        $set: ParameterSetMock(8, 8, 'Other'),
      },
    })
    wrapper.setProps(props)
  })

  it('should update parameter set', () => {
    wrapper
      .find(OptionEditor)
      .props()
      .setAnalysisOption({
        name: 'name',
        option: { value: 'Regression' },
      })
  })
})
