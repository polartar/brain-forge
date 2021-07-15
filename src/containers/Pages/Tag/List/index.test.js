import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount, shallow } from 'enzyme'
import { Button, Table } from 'antd'
import { CREATE_TAG } from 'store/modules/sites'
import { TagForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { TagMock, StudiesMock, SubjectsMock, SessionsMock } from 'test/mocks'
import { TagListPage } from './index'

const initialProps = {
  tags: [
    {
      ...TagMock(),
      studies: StudiesMock(3),
      subjects: SubjectsMock(2),
      sessions: SessionsMock(1),
    },
  ],
  status: 'INIT',
  listTag: jest.fn(),
  createTag: jest.fn(),
  updateTag: jest.fn(),
  deleteTag: jest.fn(),
}

describe('TagListPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TagListPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(Table).length).toBe(1)

    expect(initialProps.listTag).toHaveBeenCalledTimes(1)
  })

  it('should show delete confirm modal', () => {
    wrapper = mount(
      <Router>
        <TagListPage {...initialProps} />
      </Router>,
    )
    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')

    const props = {
      ...initialProps,
      tags: [
        {
          ...TagMock(),
          studies: [],
          sessions: [],
          subjects: [],
        },
      ],
    }
    wrapper = mount(
      <Router>
        <TagListPage {...props} />
      </Router>,
    )
    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')
  })

  it('should show tag form for create', () => {
    wrapper
      .find(Button)
      .first()
      .simulate('click')

    const payload = { data: { label: 'tag-1' } }
    wrapper
      .find(TagForm)
      .props()
      .onSubmit(payload)

    expect(initialProps.createTag).toHaveBeenCalledWith(payload.data)
  })

  it('should show tag form for edit', () => {
    wrapper = mount(
      <Router>
        <TagListPage {...initialProps} />
      </Router>,
    )

    wrapper
      .find(Button)
      .first()
      .simulate('click')
    wrapper
      .find('.edit-btn')
      .first()
      .simulate('click')

    const payload = { id: 1, data: { label: 'tag-2' } }
    wrapper
      .find(TagForm)
      .props()
      .onSubmit(payload)

    expect(initialProps.updateTag).toHaveBeenCalledWith(payload)
  })

  it('should close drawer after success', () => {
    wrapper
      .find(Button)
      .first()
      .simulate('click')
    expect(wrapper.find(TagForm).length).toBe(1)

    wrapper.setProps({ status: successAction(CREATE_TAG) })
    wrapper.setProps({ status: 'INIT' })
  })
})
