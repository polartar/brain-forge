import React from 'react'
import { shallow } from 'enzyme'
import { Descriptions } from 'antd'
import { UPDATE_PROFILE } from 'store/modules/auth'
import { Drawer, ProfileForm } from 'components'
import { successAction } from 'utils/state-helpers'
import { MyProfile } from '../Profile'

const { Item } = Descriptions

const initialProps = {
  user: {
    id: 1,
    email: 'email@gmail.com',
    email_verified: false,
    first_name: 'John',
    last_name: 'Doe',
    username: 'johndoe',
    is_superuser: false,
  },
  status: 'INIT',
  error: null,
  updateProfile: jest.fn(),
}

describe('MyProfile', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<MyProfile {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Item).length).toBe(5)
    expect(wrapper.find(ProfileForm).length).toBe(1)
  })

  it('should show swal and close drawer', () => {
    wrapper.setProps({ status: UPDATE_PROFILE })
    wrapper.setProps({ status: successAction(UPDATE_PROFILE) })
  })

  it('should toggle drawer', () => {
    const drawer = wrapper.find(Drawer)
    drawer.props().onClose()
  })

  it('should submit form values', () => {
    const form = wrapper.find(ProfileForm)
    const values = { username: 'alex' }
    form.props().onSubmit(values)

    expect(initialProps.updateProfile).toHaveBeenCalledWith(values)
  })

  it('should render email unverified', () => {
    wrapper.setProps({ user: { ...initialProps.user, email_verified: true, is_superuser: true } })
  })
})
