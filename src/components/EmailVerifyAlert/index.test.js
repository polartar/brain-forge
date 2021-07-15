import React from 'react'
import { mount } from 'enzyme'
import { Alert, Button } from 'antd'
import { UserMock } from 'test/mocks'
import EmailVerifyAlert from './index'

const initialProps = {
  user: UserMock(),
  sending: false,
  onSendEmail: jest.fn(),
}

describe('EmailVerifyAlert', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<EmailVerifyAlert {...initialProps} />)
  })
  it('should render default component', () => {
    const { user } = initialProps
    const { first_name, last_name, email } = user

    wrapper.find(Button).simulate('click')

    expect(wrapper.contains(Alert)).toBeTruthy()
    expect(wrapper.exists('.ant-alert-warning')).toBeTruthy()
    expect(wrapper.find('.ant-alert-message').text()).toContain(email)
    expect(wrapper.text()).toContain(`${first_name} ${last_name}`)
    expect(initialProps.onSendEmail).toHaveBeenCalledTimes(1)
  })

  it('should render component with loading button', () => {
    const props = { ...initialProps, sending: true, onSendEmail: jest.fn() }
    wrapper.setProps(props)

    const button = wrapper.find(Button)

    button.simulate('click')

    expect(button.prop('disabled')).toBeTruthy()
    expect(button.prop('loading')).toBeTruthy()
    expect(button.text()).toContain('Sending...')
    expect(props.onSendEmail).toHaveBeenCalledTimes(0)
  })
})
