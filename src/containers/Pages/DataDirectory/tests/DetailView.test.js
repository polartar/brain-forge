import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import DetailView from '../DetailView'

const { TabPane } = Tabs

const initialProps = {
  datafile: {
    id: 1,
  },
}

describe('DetailView', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<DetailView {...initialProps} />)
  })

  it('should render component', async () => {
    expect(wrapper.find(TabPane).length).toBe(2)
  })
})
