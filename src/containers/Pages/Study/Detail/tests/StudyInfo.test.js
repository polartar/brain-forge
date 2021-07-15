import React from 'react'
import { shallow } from 'enzyme'
import { Descriptions } from 'antd'
import { Drawer, StudyForm } from 'components'
import { UPDATE_STUDY } from 'store/modules/sites'
import { successAction } from 'utils/state-helpers'
import { UserMock, SitesMock, StudyMock } from 'test/mocks'
import StudyInfo from '../StudyInfo'

const { Item } = Descriptions

const initialProps = {
  user: UserMock(),
  sites: SitesMock(3),
  study: StudyMock(1),
  editable: true,
  status: 'INIT',
  updateStudy: jest.fn(),
}

describe('StudyInfo', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StudyInfo {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Item).length).toBe(5)
    expect(wrapper.find(StudyForm).length).toBe(1)
  })

  it('should hide drawer', () => {
    wrapper.setProps({ status: UPDATE_STUDY })
    wrapper.setProps({ status: successAction(UPDATE_STUDY) })
  })

  it('should toggle drawer', () => {
    const drawer = wrapper.find(Drawer)
    drawer.props().onClose()
  })

  it('should submit form', () => {
    wrapper.setProps({
      study: {
        ...StudyMock(1),
        is_managed: true,
      },
    })
    const values = { id: 2, data: { name: 'study 2' } }
    const form = wrapper.find(StudyForm)
    form.props().onSubmit(values)

    expect(initialProps.updateStudy).toHaveBeenCalledWith(values)
  })
})
