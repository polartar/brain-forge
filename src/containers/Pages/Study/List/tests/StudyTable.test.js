import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { mount, shallow } from 'enzyme'
import { Button, Empty, Table } from 'antd'
import { CREATE_STUDY } from 'store/modules/sites'
import { Drawer, StudyForm, TagEditor } from 'components'
import { successAction } from 'utils/state-helpers'
import { UserMock, SitesMock, StudyMock, TagsMock } from 'test/mocks'
import { StudyTable } from '../StudyTable'

const initialProps = {
  user: UserMock(),
  studies: [{ ...StudyMock(1), tags: TagsMock() }, StudyMock(2), StudyMock(3)],
  sites: SitesMock(3),
  shared: false,
  title: 'title',
  status: 'INIT',
  tags: TagsMock(),
  isSuperUser: true,
  isDesktop: true,
  isMobile: false,
  createStudy: jest.fn(),
  deleteStudy: jest.fn(),
  assignTags: jest.fn(),
}

describe('StudyTable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StudyTable {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(StudyForm).length).toBe(1)
    expect(wrapper.find(Table).length).toBe(1)

    wrapper.find(Button).simulate('click')

    wrapper.setProps({ isDesktop: false, isMobile: true })
  })

  it('should render empty', () => {
    wrapper.setProps({ studies: [] })
    expect(wrapper.find(Empty).length).toBe(1)
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: CREATE_STUDY })
    wrapper.setProps({ status: successAction(CREATE_STUDY) })
    expect(wrapper.state().showAddDrawer).toBeFalsy()

    wrapper.setProps({ shared: true })
    expect(wrapper.find(Drawer).length).toBe(0)
  })

  it('should submit form values', () => {
    const values = { data: { full_name: 'study' } }
    const form = wrapper.find(StudyForm)
    form.props().onSubmit(values)

    expect(initialProps.createStudy).toHaveBeenCalledWith(values.data)
  })

  it('should change tags on study', () => {
    const selectedTags = [1, 2]
    wrapper = mount(
      <Router>
        <StudyTable {...initialProps} />
      </Router>,
    )
    wrapper
      .find(TagEditor)
      .first()
      .props()
      .onChange(selectedTags)
    expect(initialProps.assignTags).toHaveBeenCalledWith({ study: 1, tags: selectedTags })
  })

  it('should delete study', () => {
    wrapper = mount(
      <Router>
        <StudyTable {...initialProps} />
      </Router>,
    )
    wrapper
      .find('.delete-btn')
      .first()
      .simulate('click')

    // wrapper
    //   .find('.edit-btn')
    //   .first()
    //   .simulate('click')

    // expect(initialProps.setUpdateStudy).toHaveBeenCalledTimes(1)
  })
})
