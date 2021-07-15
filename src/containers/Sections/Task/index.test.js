import React from 'react'
import { shallow } from 'enzyme'
import { Switch, Tabs } from 'antd'
import { ANALYSIS_STATES } from 'config/base'
import { TaskList } from 'components'
import { AllAnalysisTypesMock, UserMock, UsersMock, StudiesMock } from 'test/mocks'
import { TaskSection } from './index'

const initialProps = {
  analysisTypes: AllAnalysisTypesMock(),
  analsysisUsers: [],
  user: UserMock(),
  analyses: {
    result: [],
  },
  studies: StudiesMock(),
  status: 'INIT',
  analysisUsers: UsersMock(),
  listAnalysis: jest.fn(),
  deleteAnalysis: jest.fn(),
  clearAnalysis: jest.fn(),
  listAnalysisUser: jest.fn(),
  listStudy: jest.fn(),
}

describe('TaskSection', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskSection {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TaskList).length).toBe(8)

    expect(initialProps.listAnalysisUser).toHaveBeenCalled()
    expect(initialProps.listStudy).toHaveBeenCalled()

    const tab = wrapper.find(Tabs).first()
    tab.props().onChange('mine')
    tab.props().onChange('shared')
  })

  it('should render one Tab for superusers', () => {
    wrapper.setProps({ user: { ...initialProps.user, is_superuser: true } })
    expect(wrapper.find(Tabs).length).toBe(1)
    expect(wrapper.find(TaskList).length).toBe(4)

    const tabs = wrapper.find(Tabs)
    tabs.props().onChange(ANALYSIS_STATES.completed.name)
  })

  it('should render three Tabs for regular users', () => {
    expect(wrapper.find(Tabs).length).toBe(3)
    expect(wrapper.find(TaskList).length).toBe(8)
  })

  it('should show checkboxes for selecting tasks', () => {
    const props = {
      ...initialProps,
      user: { ...initialProps.user, is_superuser: true },
    }
    wrapper = shallow(<TaskSection {...props} />)
    expect(wrapper.find(Tabs).props().tabBarExtraContent.props.checked).toBe(false)
    wrapper.setState({ selection: true })

    // Check switch selected.
    expect(wrapper.find(Tabs).props().tabBarExtraContent.props.checked).toBe(true)
  })
})
