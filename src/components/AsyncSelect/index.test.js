import React from 'react'
import { shallow } from 'enzyme'
import { Select, Option } from 'components'
import AsyncSelect from './index'

const initialProps = {
  placeholder: 'Series',
  value: 1,
  fetchUrl: 'data-directory/series',
  onChange: jest.fn(),
}

describe('AsyncSelect', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AsyncSelect {...initialProps} />)
  })

  it('should render default component', () => {
    expect(wrapper.find(Select).length).toBe(1)

    wrapper.setProps({ value: 2 })
    wrapper.setProps({ value: null })
  })

  it('should trigger value change', () => {
    const series = 3
    wrapper
      .find(Select)
      .props()
      .onChange(series)

    expect(initialProps.onChange).toHaveBeenCalledWith(series)
  })

  it('should show options', () => {
    const data = [{ value: 1, text: 'series-1' }, { value: 2, text: 'series-2' }]
    wrapper.setState({ data })
    expect(wrapper.find(Option).length).toBe(data.length)
  })

  it('should update not found content message', () => {
    wrapper.setState({ fetching: true })
    wrapper.setState({ fetching: false, search: '' })

    expect(wrapper.find(Select).props().notFoundContent).toEqual('Start typing')

    wrapper.setState({ fetching: false, search: 'series-1' })

    expect(wrapper.find(Select).props().notFoundContent).toEqual('Not Found')
  })
})
