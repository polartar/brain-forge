import React from 'react'
import { shallow } from 'enzyme'
import { Table, Empty } from 'antd'
import { AnalysesMock } from 'test/mocks'
import ExpandedRow from '../ExpandedRow'

const initialProps = {
  analyses: AnalysesMock(),
  downloadingAnalysis: false,
}

describe('DataDirectory ExpandedRow', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ExpandedRow {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ analyses: [] })
    expect(wrapper.find(Table).length).toBe(0)
    expect(wrapper.find(Empty).length).toBe(1)
  })
})
