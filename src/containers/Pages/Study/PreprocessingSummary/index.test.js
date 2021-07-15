import React from 'react'
import { shallow } from 'enzyme'
import { PreprocessingSummaryTable } from 'containers'
import { PreprocessingSummaryMock } from 'test/mocks'
import { PreprocessingSummaryPage } from './index'

const initialProps = {
  match: {
    params: { studyLabel: 'devcog' },
  },
  study: PreprocessingSummaryMock(),
  getStudy: jest.fn(),
}

describe('PreprocessingSummaryPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<PreprocessingSummaryPage {...initialProps} />)
  })

  it('should render component', () => {
    const { studyLabel } = initialProps.match.params
    expect(initialProps.getStudy).toHaveBeenCalledWith(studyLabel)
    expect(wrapper.find(PreprocessingSummaryTable).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ study: null })
    expect(wrapper.find(PreprocessingSummaryTable).length).toBe(0)
  })
})
