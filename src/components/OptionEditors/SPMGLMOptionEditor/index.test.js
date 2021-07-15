import React from 'react'
import { shallow } from 'enzyme'
import update from 'immutability-helper'
import { Input, InputNumber } from 'antd'
import { Select } from 'components'
import { AnalysisOptionsMock } from 'test/mocks'
import { SPMGLMOptionEditor } from './index'

const initialProps = {
  allFiles: [],
  analysisOptions: AnalysisOptionsMock('SPMGLM'),
  readOnly: false,
  status: 'INIT',
  error: '',
  form: {
    getFieldDecorator: jest.fn(opts => c => c),
    setFieldsValue: jest.fn(),
  },
  setAnalysisOption: jest.fn(),
  listDataFile: jest.fn(),
}

describe('SPMGLMOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SPMGLMOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(InputNumber).length).toBe(3)
    expect(wrapper.find(Select).length).toBe(5)

    const props = update(initialProps, {
      analysisOptions: {
        Bases: { value: { $set: 'bases ' } },
      },
      readOnly: { $set: true },
    })

    wrapper.setProps(props)

    expect(wrapper.find(Input).length).toBe(1)
    expect(wrapper.find(InputNumber).length).toBe(5)
    expect(wrapper.find(Select).length).toBe(3)
  })

  it('should change option values', () => {
    wrapper.find(InputNumber).forEach(input => input.props().onChange('value'))
    wrapper.find(Select).forEach(select => {
      if (select.props().id === 'Base_Derivatives') {
        select.props().onChange('[0,0]')
      } else {
        select.props().onChange('value')
      }
    })

    let props = update(initialProps, {
      analysisOptions: {
        Bases: {
          value: { $set: null },
        },
      },
    })
    wrapper.setProps(props)
    wrapper.find(InputNumber).forEach(input => input.props().onChange('value'))

    props = update(initialProps, {
      analysisOptions: {
        Bases: {
          value: { $set: 'hrf' },
          params: {
            derivs: { $set: null },
          },
        },
      },
      readOnly: { $set: true },
    })
    wrapper.setProps(props)
  })
})
