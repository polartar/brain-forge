import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'
import SubjectSearchForm from '../SubjectSearchForm'
import SubjectFilter from './index'

const initialProps = {
  studyLabel: 'devcog',
  value: null,
  onFilter: jest.fn(),
}

describe('SubjectFilter', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<SubjectFilter {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Button).length).toBe(1)
    expect(wrapper.find(SubjectSearchForm).length).toBe(1)

    wrapper.setProps({ value: 'subject-1' })
    expect(wrapper.find(Button).props().type).toBe('primary')
  })

  it('should show subject search form', () => {
    wrapper.find(Button).simulate('click')
    expect(wrapper.find(SubjectSearchForm).props().visible).toBeTruthy()
  })

  it('should submit searched value', () => {
    const subject = 'subject-2'
    wrapper
      .find(SubjectSearchForm)
      .props()
      .onSubmit(subject)

    expect(initialProps.onFilter).toHaveBeenCalledWith(subject)
  })
})
