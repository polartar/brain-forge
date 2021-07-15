import React from 'react'
import { shallow } from 'enzyme'
import { Form, InputNumber } from 'antd'
import { Select } from 'components'
import { AnalysisOptionsMock } from 'test/mocks'
import { GroupSPMGLMOptionEditor } from './index'

const { Item: FormItem } = Form

const initialProps = {
  analysisOptions: AnalysisOptionsMock('GroupSPMGLM'),
  readOnly: false,
  status: 'INIT',
  error: null,
  form: {
    getFieldDecorator: jest.fn(opts => c => c),
    setFieldsValue: jest.fn(),
  },
  setAnalysisOption: jest.fn(),
  listDataFile: jest.fn(),
}

describe('GroupSPMGLMOptionEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<GroupSPMGLMOptionEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(FormItem).length).toBe(3)
  })

  it('should update option', () => {
    const selects = wrapper.find(Select)
    selects.forEach(select => select.props().onChange(1))

    wrapper
      .find(InputNumber)
      .props()
      .onChange(1)

    expect(initialProps.setAnalysisOption).toHaveBeenCalledTimes(3)
  })
})
