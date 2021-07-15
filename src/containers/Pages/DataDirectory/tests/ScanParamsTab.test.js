import React from 'react'
import { mount } from 'enzyme'
import { Alert } from 'antd'
import ReactJson from 'react-json-view'
import { Loader } from 'components'
import ScanParamsTab from '../ScanParamsTab'

const initialProps = {
  loading: false,
  error: null,
  data: { id: 1 },
}

describe('ScanParamsTab', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<ScanParamsTab {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(ReactJson).length).toBe(1)
  })

  it('should show loading', () => {
    wrapper.setProps({ loading: true })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should show error', () => {
    wrapper.setProps({ error: 'Has error' })
    expect(wrapper.find(Alert).length).toBe(1)
  })
})
