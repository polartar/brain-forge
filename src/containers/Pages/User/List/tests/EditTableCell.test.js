import React from 'react'
import { shallow } from 'enzyme'
import { Button, Input } from 'antd'

import EditTableCell from '../EditTableCell'

describe('EditTableCell', () => {
  it('should edit text field and submit', () => {
    const fn = jest.fn()
    const wrapper = shallow(<EditTableCell onChange={fn} />)

    wrapper.setProps({ editable: true })
    wrapper.props().onMouseEnter()

    expect(wrapper.find(Button).length).toBe(1)

    const editBtn = wrapper.find(Button)
    editBtn.simulate('click')

    expect(wrapper.find(Input).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(2)

    wrapper.find(Input).simulate('change', { target: { value: 'test@gmail.com' } })

    wrapper.find('#submit').simulate('click')

    expect(fn).toHaveBeenCalled()
  })

  it('should edit radio button and submit', () => {
    const fn = jest.fn()
    const wrapper = shallow(<EditTableCell onChange={fn} />)

    wrapper.setProps({ editable: true })
    wrapper.props().onMouseEnter()

    expect(wrapper.find(Button).length).toBe(1)

    const editBtn = wrapper.find(Button)
    editBtn.simulate('click')

    wrapper.setProps({ input: 'select' })

    expect(wrapper.find(Button).length).toBe(2)
  })
})
