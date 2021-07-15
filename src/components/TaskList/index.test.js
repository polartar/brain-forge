import React from 'react'
import { shallow, mount } from 'enzyme'
import { Button, Checkbox, Dropdown, Input, Radio, Table } from 'antd'
import { BrowserRouter as Router } from 'react-router-dom'
import { AllAnalysisTypesMock, AnalysesMock, UsersMock, UserMock, StudiesMock } from 'test/mocks'
import { TaskList } from './index'

const initialProps = {
  analysisTypes: AllAnalysisTypesMock(),
  analyses: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 2,
    results: AnalysesMock(),
  },
  analysisUsers: UsersMock(5),
  studies: StudiesMock(),
  type: 'completed',
  user: UserMock(1),
  shared: false,
  selection: false,
  loading: true,
  isDesktop: true,
  isNotXLScreen: false,
  viewResult: jest.fn(),
  fetchData: jest.fn(),
  deleteAnalysis: jest.fn(),
}

describe('TaskList', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TaskList {...initialProps} />)
  })

  it('should render default component', () => {
    expect(wrapper.find(Table).length).toBe(1)
  })

  it('should handle filter study correctly', () => {
    wrapper = mount(
      <Router>
        <TaskList {...initialProps} />
      </Router>,
    )
    expect(wrapper.find('i.anticon-filter').exists()).toBe(true)

    // Search for the table header for User column.
    const studyColumnWrapper = wrapper.find('thead.ant-table-thead th').findWhere(elem => elem.text() === 'Study')
    expect(studyColumnWrapper.exists()).toBe(true)
    const studyColumn = studyColumnWrapper.first()

    // Open up the filter dropdown.
    const studyFilter = studyColumn.find('i.anticon-filter').first()
    studyFilter.simulate('click')

    // Make sure that the filter dropdown has the right number of choices.
    expect(wrapper.find(Dropdown).exists()).toBe(true)
    const filterDiv = wrapper.find(Dropdown).first()
    const filterChoicesWrapper = filterDiv.find(Radio)
    expect(filterChoicesWrapper.length).toBe(1)

    // Select the first user, which will have id = 1.
    const filterChoice = filterChoicesWrapper.first()
    filterChoice.simulate('click')
    // Click Ok button.
    const confirmBtn = filterDiv.find('a.confirm').first()
    confirmBtn.simulate('click')

    // Make the right API call have been sent.
    expect(initialProps.fetchData).toHaveBeenLastCalledWith({
      study: 1,
      ordering: '-date_time_end',
      page: initialProps.analyses.currentPage,
      status: initialProps.type,
      shared: 'off',
    })
  })

  it('should handle filter username correctly', () => {
    wrapper = mount(
      <Router>
        <TaskList {...initialProps} />
      </Router>,
    )
    expect(wrapper.find('i.anticon-filter').exists()).toBe(true)

    // Search for the table header for User column.
    const userColumnWrapper = wrapper.find('thead.ant-table-thead th').findWhere(elem => elem.text() === 'User')
    expect(userColumnWrapper.exists()).toBe(true)
    const userColumn = userColumnWrapper.first()

    // Open up the filter dropdown.
    const userFilter = userColumn.find('i.anticon-filter').first()
    userFilter.simulate('click')

    // Make sure that the filter dropdown has the right number of choices.
    expect(wrapper.find(Dropdown).exists()).toBe(true)
    const filterDiv = wrapper.find(Dropdown).at(1)
    const filterChoicesWrapper = filterDiv.find(Radio)
    expect(filterChoicesWrapper.length).toBe(5)

    // Select the first user, which will have id = 1.
    const filterChoice = filterChoicesWrapper.first()
    filterChoice.simulate('click')
    // Click Ok button.
    const confirmBtn = filterDiv.find('a.confirm').first()
    confirmBtn.simulate('click')

    // Make the right API call have been sent.
    expect(initialProps.fetchData).toHaveBeenLastCalledWith({
      created_by: 1,
      ordering: '-date_time_end',
      page: initialProps.analyses.currentPage,
      status: initialProps.type,
      shared: 'off',
    })
  })

  it('should handle filter analysis type correctly', () => {
    wrapper = mount(
      <Router>
        <TaskList {...initialProps} />
      </Router>,
    )
    expect(initialProps.fetchData).toHaveBeenCalled()
    expect(wrapper.find('i.anticon-filter').exists()).toBe(true)

    // Search for the table header for Analysis column.
    const analysisColumnWrapper = wrapper
      .find('thead.ant-table-thead th')
      .findWhere(elem => elem.text() === 'Analysis Type')

    expect(analysisColumnWrapper.exists()).toBe(true)
    const analysisColumn = analysisColumnWrapper.first()

    // Open up the filter dropdown.
    const analysisFilter = analysisColumn.find('i.anticon-filter').first()
    analysisFilter.simulate('click')

    // Make sure that the filter dropdown has the right number of choices.
    expect(analysisColumn.find(Dropdown).exists()).toBe(true)
    const filterDiv = analysisColumn.find(Dropdown).first()
    const filterChoicesWrapper = filterDiv.find(Radio)
    expect(filterChoicesWrapper.length).toBeGreaterThanOrEqual(11)

    // Select the first analysis_type, which will have id = 1.
    const filterChoice = filterChoicesWrapper.first()
    filterChoice.simulate('click')

    // Click OK button.
    const confirmBtn = filterDiv.find('a.confirm').first()
    confirmBtn.simulate('click')

    // Make the right API call have been send.
    expect(initialProps.fetchData).toHaveBeenLastCalledWith({
      analysis_type: 1,
      ordering: '-date_time_end',
      page: initialProps.analyses.currentPage,
      status: 'completed',
      shared: 'off',
    })
  })

  it('should handle search name correctly', () => {
    wrapper = mount(
      <Router>
        <TaskList {...initialProps} />
      </Router>,
    )
    expect(initialProps.fetchData).toHaveBeenCalled()
    expect(wrapper.find('span.anticon-search').exists()).toBe(true)

    // Search for the table header for Name column.
    const nameColumnWrapper = wrapper.find('thead.ant-table-thead th').findWhere(elem => elem.text() === 'Name')

    expect(nameColumnWrapper.exists()).toBe(true)
    const nameColumn = nameColumnWrapper.first()

    // Open up the search box.
    const nameSearch = nameColumn.find('span.anticon-search').first()
    nameSearch.simulate('click')

    // Make sure that the search has input.
    const searchInputWrapper = nameColumn.find(Input)
    expect(searchInputWrapper.length).toBe(1)

    searchInputWrapper.props().onChange({ target: { value: 'test' } })
    searchInputWrapper.simulate('change')

    // Click OK Button.
    const searchBtn = nameColumn.find('button[name="searchBtn"]').first()
    searchBtn.simulate('click')

    // Make the right API call have been send.
    expect(initialProps.fetchData).toHaveBeenLastCalledWith({
      name: 'test',
      ordering: '-date_time_end',
      page: initialProps.analyses.currentPage,
      status: 'completed',
      shared: 'off',
    })
  })

  it('should handle search description correcctly', () => {
    wrapper = mount(
      <Router>
        <TaskList {...initialProps} />
      </Router>,
    )
    expect(initialProps.fetchData).toHaveBeenCalled()
    expect(wrapper.find('span.anticon-search').exists()).toBe(true)

    // Search for the table header for description column.
    const descriptionColumnWrapper = wrapper
      .find('thead.ant-table-thead th')
      .findWhere(elem => elem.text() === 'Description')

    expect(descriptionColumnWrapper.exists()).toBe(true)
    const descriptionColumn = descriptionColumnWrapper.first()

    // Open up the search box.
    const descriptionSearch = descriptionColumn.find('span.anticon-search').first()
    descriptionSearch.simulate('click')

    // Make sure that the search has input.
    const searchInputWrapper = descriptionColumn.find(Input)
    expect(searchInputWrapper.length).toBe(1)

    searchInputWrapper.props().onChange({ target: { value: 'preprocess' } })
    searchInputWrapper.simulate('change')

    // Click OK button.
    const searchBtn = descriptionColumn.find('button[name="searchBtn"]').first()
    searchBtn.simulate('click')

    // Make the right API call have been send.
    expect(initialProps.fetchData).toHaveBeenLastCalledWith({
      description: 'preprocess',
      ordering: '-date_time_end',
      page: initialProps.analyses.currentPage,
      status: 'completed',
      shared: 'off',
    })
  })

  it('should display checkboxes when Select is switched on', () => {
    expect(wrapper.find(Checkbox).exists()).toBe(false)

    const props = { ...initialProps, selection: true }
    wrapper = mount(
      <Router>
        <TaskList {...props} />
      </Router>,
    )
    expect(wrapper.find(Checkbox).exists()).toBe(true)
  })

  it('should display Delete btn when checkbox is selected', () => {
    const props = { ...initialProps, selection: true }
    wrapper = mount(
      <Router>
        <TaskList {...props} />
      </Router>,
    )
    expect(wrapper.find(Checkbox).exists()).toBe(true)

    // Empty selected rows.
    const tasklist = wrapper.find(TaskList).first()
    expect(tasklist.state('selectedRowKeys').length).toBe(0)

    // Set selected rows.
    let deleteBtn = wrapper.find(Button).findWhere(elem => elem.prop('name') === 'delete-analyses')
    expect(deleteBtn.length).toBe(0)

    tasklist.setState({ selectedRowKeys: [props.analyses.results[0].id] })
    deleteBtn = wrapper.find(Button).findWhere(elem => elem.prop('name') === 'delete-analyses')
    expect(deleteBtn.length).toBeGreaterThan(0)
  })

  it('should issue delete request when Modal delete is confirmed', () => {
    const props = { ...initialProps, selection: true }
    wrapper = mount(
      <Router>
        <TaskList {...props} />
      </Router>,
    )

    const tasklist = wrapper.find(TaskList).first()
    const instance = tasklist.instance()
    instance.handleConfirmDelete([props.analyses.results[0].id, props.analyses.results[1].id])
    expect(props.deleteAnalysis).toHaveBeenCalledTimes(2)
  })
})
