import React from 'react'
import update from 'immutability-helper'
import { shallow } from 'enzyme'
import { SEND_VERIFY_EMAIL } from 'store/modules/auth'
import { TaskSection } from 'containers'
import { EmailVerifyAlert } from 'components'
import { successAction } from 'utils/state-helpers'
import { UserMock } from 'test/mocks'
import { StatusPage } from './index'

const initialProps = {
  status: '',
  user: {
    ...UserMock(),
    email_verified: true,
  },
  error: null,
  sendVerifyEmail: jest.fn(),
}

describe('StatusPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<StatusPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TaskSection).length).toBe(1)
  })

  it('should show email verify alert', () => {
    let props = update(initialProps, {
      user: { email_verified: { $set: false } },
      status: { $set: SEND_VERIFY_EMAIL },
    })
    wrapper.setProps(props)

    expect(wrapper.find(EmailVerifyAlert).length).toBe(1)
    expect(wrapper.find(EmailVerifyAlert).props('sending')).toBeTruthy()

    props = update(initialProps, {
      status: { $set: successAction(SEND_VERIFY_EMAIL) },
    })
    wrapper.setProps(props)
  })
})
