import React from 'react'
import { shallow } from 'enzyme'
import { GET_PROFILE } from 'store/modules/auth'
import { LIST_SITE, LIST_STUDY } from 'store/modules/sites'
import { Loader, Tabs } from 'components'
import { UserMock, SitesMock, StudiesMock, TagsMock } from 'test/mocks'
import StudyTable from '../StudyTable'
import { StudyListPage } from '../index'

const initialProps = {
  user: UserMock(),
  sites: SitesMock(3),
  studies: StudiesMock(3),
  tags: TagsMock(),
  isSuperUser: true,
  status: 'INIT',
  authStatus: 'INIT',
  getProfile: jest.fn(),
  listSite: jest.fn(),
  listStudy: jest.fn(),
  createStudy: jest.fn(),
  // updateStudy: jest.fn(),
  deleteStudy: jest.fn(),
  listTag: jest.fn(),
  assignTags: jest.fn(),
}

describe('StudyListPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StudyListPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Tabs).length).toBe(1)
    expect(wrapper.find(StudyTable).length).toBe(3)

    expect(initialProps.listStudy).toHaveBeenCalledWith({
      params: { shared: 'off' },
    })
    expect(initialProps.listSite).toHaveBeenCalledTimes(1)
    expect(initialProps.getProfile).toHaveBeenCalledTimes(1)
    expect(initialProps.listTag).toHaveBeenCalledTimes(1)
  })

  it('should render one study table', () => {
    wrapper.setProps({ user: { ...initialProps.user, is_superuser: true } })
    expect(wrapper.find(StudyTable).length).toBe(1)

    // const updatingStudy = { id: 1, name: 'study-1' }
    // wrapper
    //   .find(StudyTable)
    //   .props()
    //   .setUpdateStudy(updatingStudy)
    // expect(wrapper.state('updatingStudy')).toEqual(updatingStudy)
    // expect(wrapper.state('showDrawer')).toBeTruthy()
  })

  it('should change tab', () => {
    const tabs = wrapper.find(Tabs)

    tabs.props().onChange('mine')
    expect(initialProps.listStudy).toHaveBeenCalledWith({
      params: { shared: 'off' },
    })

    tabs.props().onChange('sharedWithMe')
    expect(initialProps.listStudy).toHaveBeenCalledWith({
      params: { shared: 'on' },
    })

    tabs.props().onChange('datableStudies')
    expect(initialProps.listStudy).toHaveBeenCalledWith({
      params: { shared: 'data' },
    })
  })

  it('should render loader', () => {
    wrapper.setProps({ status: LIST_SITE })
    wrapper.setProps({ status: LIST_STUDY })
    wrapper.setProps({ status: null, authStatus: GET_PROFILE })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  // it('should submit form values', () => {
  //   const values = {
  //     id: 1,
  //     data: {
  //       name: 'Study 1',
  //       label: 'study-1',
  //     },
  //   }
  //   wrapper
  //     .find(StudyForm)
  //     .props()
  //     .onSubmit(values)
  //   expect(initialProps.updateStudy).toHaveBeenCalledWith(values)
  // })
})
