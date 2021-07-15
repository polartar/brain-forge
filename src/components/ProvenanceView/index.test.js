import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { ProvenanceMock } from 'test/mocks'
import ProvenanceView from './index'

const { TabPane } = Tabs

const initialProps = ProvenanceMock()

describe('ProvenanceView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ProvenanceView {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Tabs).length).toBe(1)
    expect(wrapper.find(TabPane).length).toBe(6)

    const props = update(initialProps, {
      cpuinfo: { $set: { brand: 'abc' } },
    })
    wrapper.setProps(props)
  })
})
