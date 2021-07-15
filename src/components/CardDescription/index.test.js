import React from 'react'
import { mount } from 'enzyme'
import { Tag } from 'antd'
import { TAG_COLORS } from 'config/base'
import { CardSetsMock } from 'test/mocks'
import { CardDescription } from './index'

const initialProps = {
  baseUrl: '/base',
  description: 'Description',
  history: {
    push: jest.fn(),
  },
  sets: CardSetsMock(5),
}

describe('CardDescription', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<CardDescription {...initialProps} />)
  })

  it('should render component', () => {
    const firstTag = wrapper.find(Tag).first()

    expect(wrapper.find(Tag).length).toBe(initialProps.sets.length)
    expect(firstTag.text()).toBe(initialProps.sets[0].name)
    expect(firstTag.prop('color')).toBe(TAG_COLORS[0])
  })

  it('should trigger tag click', () => {
    const firstTag = wrapper.find(Tag).first()

    firstTag.simulate('click')
    expect(initialProps.history.push).toHaveBeenCalledTimes(1)
  })

  it('should render component without links', () => {
    wrapper.setProps({ sets: [] })

    expect(wrapper.text()).toBe(initialProps.description)
    expect(wrapper.find(Tag).length).toBe(0)
  })
})
