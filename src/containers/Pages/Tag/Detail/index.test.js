import React from 'react'
import { shallow } from 'enzyme'
import { Descriptions, Tag } from 'antd'
import { GET_TAG } from 'store/modules/sites'
import { Loader } from 'components'
import { TagMock } from 'test/mocks'
import { TagDetailPage } from './index'

const { Item } = Descriptions

const initialProps = {
  tag: {
    ...TagMock(),
    subjects: [],
    sessions: [],
  },
  match: {
    params: {
      tagId: 1,
    },
  },
  status: 'INIT',
  getTag: jest.fn(),
}

describe('TagDetailPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<TagDetailPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Tag).length).toBe(initialProps.tag.studies.length + 1)
    expect(wrapper.find(Item).length).toBe(4)

    expect(initialProps.getTag).toHaveBeenCalledTimes(1)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: GET_TAG })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render nothing', () => {
    wrapper.setProps({ tag: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
