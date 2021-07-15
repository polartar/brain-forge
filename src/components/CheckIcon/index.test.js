import React from 'react'
import { mount } from 'enzyme'
import CheckIcon from './index'

const initialProps = {
  checked: true,
}

describe('CheckIcon', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(<CheckIcon {...initialProps} />)
  })

  it('should render component', () => {
    wrapper.find(CheckIcon).first()
    wrapper.setProps({ checked: false })
  })
})
