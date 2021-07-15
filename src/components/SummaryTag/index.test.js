import React from 'react'
import { Link } from 'react-router-dom'
import { shallow } from 'enzyme'
import SummaryTag from './index'

const initialProps = {
  tag: 'success',
}

describe('SummaryTag', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SummaryTag {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find('div').length).toBe(1)
    expect(wrapper.find('div').prop('className')).toBe('summary-tag success')

    wrapper.setProps({ id: 1 })
    expect(wrapper.find(Link).length).toBe(1)
  })
})
