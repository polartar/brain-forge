import React from 'react'
import { shallow } from 'enzyme'
import { Button, Select, Tag } from 'antd'
import { TagsMock, TagMock } from 'test/mocks'
import TagEditor from './index'

const initialProps = {
  tags: TagsMock(),
  selectedTags: [TagMock(1), TagMock(2)],
  editable: true,
  isLoading: false,
  onChange: jest.fn(),
}

describe('TagEditor', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TagEditor {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Tag).length).toBe(initialProps.selectedTags.length)
    expect(wrapper.find(Button).length).toBe(1)
  })

  it('should show select and submit values', () => {
    wrapper.find(Button).simulate('click')

    expect(wrapper.find(Select).length).toBe(1)
    expect(wrapper.find(Button).length).toBe(2)

    const selected = [initialProps.tags[0].id]
    wrapper
      .find(Select)
      .props()
      .onChange(selected)
    wrapper
      .find(Button)
      .first()
      .simulate('click')
    expect(initialProps.onChange).toHaveBeenCalledWith(selected)
  })

  it('should cancel editing', () => {
    wrapper.find(Button).simulate('click')
    expect(wrapper.find(Button).length).toBe(2)

    wrapper
      .find(Button)
      .last()
      .simulate('click')
    expect(wrapper.find(Select).length).toBe(0)
    expect(wrapper.find(Button).length).toBe(1)
  })
})
