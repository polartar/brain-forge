import React from 'react'
import { shallow } from 'enzyme'
import { Pagination } from 'antd'
import { pick } from 'lodash'
import { LIST_SESSION } from 'store/modules/sites'
import { Loader } from 'components'
import { PreprocessingSummaryMock, SummarySessionsMock } from 'test/mocks'
import { PreprocessingSummaryTable } from './index'
import SubjectFilter from './SubjectFilter'

const initialProps = {
  study: PreprocessingSummaryMock(),
  sessions: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 10,
    results: SummarySessionsMock(),
  },
  status: 'INIT',
  listSession: jest.fn(),
}

describe('PreprocessingSummaryTable', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PreprocessingSummaryTable {...initialProps} />)
  })

  it('should render component', () => {
    expect(initialProps.listSession).toHaveBeenCalledTimes(1)
    expect(wrapper.find('table').length).toBe(1)
  })

  it('should render loader', () => {
    wrapper.setProps({ showTitle: true })
    wrapper.setProps({ status: LIST_SESSION })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should change pagination and filter', () => {
    const currentPage = 5
    const subject = 'subject-1'
    const pageSize = 100

    wrapper
      .find(Pagination)
      .props()
      .onChange(currentPage)

    wrapper
      .find(SubjectFilter)
      .props()
      .onFilter(subject)

    expect(pick(wrapper.state(), ['current', 'subjectFilter'])).toEqual({
      current: currentPage,
      subjectFilter: subject,
    })

    wrapper
      .find(Pagination)
      .props()
      .onShowSizeChange(currentPage, pageSize)
    expect(pick(wrapper.state(), ['current', 'pageSize'])).toEqual({
      current: 1,
      pageSize,
    })
  })
})
