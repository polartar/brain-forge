import React from 'react'
import { mount } from 'enzyme'
import PageLayout from './index'

const initialProps = {
  heading: 'Heading',
  subheading: 'Subheading',
}

describe('PageLayout', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(
      <PageLayout {...initialProps}>
        <button>Click</button>
      </PageLayout>,
    )
  })

  it('should render component', () => {
    expect(wrapper.find('.app-page__heading').length).toBe(1)
    expect(wrapper.find('.app-page__subheading-width-limit').length).toBe(1)
    expect(wrapper.find('button').length).toBe(1)
  })
})
