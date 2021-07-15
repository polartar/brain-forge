import React from 'react'
import { shallow } from 'enzyme'
import { MainApp } from './MainApp'

describe('MainApp', () => {
  it('should render component with data fetch', () => {
    const props = {
      getVersion: jest.fn(),
      listAnalysisType: jest.fn(),
      listModality: jest.fn(),
      loggedIn: true,
    }

    let wrapper = shallow(<MainApp {...props} />)
    wrapper.setProps({ loggedIn: false })

    expect(props.getVersion).toHaveBeenCalledTimes(1)
    expect(props.listAnalysisType).toHaveBeenCalledTimes(1)
    expect(props.listModality).toHaveBeenCalledTimes(1)
  })

  it('should render component without data fetch', () => {
    const props = {
      getVersion: jest.fn(),
      listAnalysisType: jest.fn(),
      listModality: jest.fn(),
      loggedIn: false,
    }

    expect(props.getVersion).toHaveBeenCalledTimes(0)
    expect(props.listAnalysisType).toHaveBeenCalledTimes(0)
    expect(props.listModality).toHaveBeenCalledTimes(0)
  })

  it('should fetch data on auth change', () => {
    const props = {
      getVersion: jest.fn(),
      listAnalysisType: jest.fn(),
      listModality: jest.fn(),
      loggedIn: false,
    }

    let wrapper = shallow(<MainApp {...props} />)
    wrapper.setProps({ loggedIn: true })

    expect(props.getVersion).toHaveBeenCalledTimes(1)
    expect(props.listAnalysisType).toHaveBeenCalledTimes(1)
    expect(props.listModality).toHaveBeenCalledTimes(1)
  })
})
