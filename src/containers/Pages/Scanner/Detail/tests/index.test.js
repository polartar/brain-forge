import React from 'react'
import { shallow } from 'enzyme'
import { Tabs } from 'antd'
import { GET_SCANNER } from 'store/modules/sites'
import { Loader } from 'components'
import { ScannerMock, PhantomAnalysisMocks } from 'test/mocks'
import { ScannerDetailPage } from '../index'

const { TabPane } = Tabs

const initialProps = {
  scanner: {
    ...ScannerMock(),
    fmri_phantom_qa_analyses: PhantomAnalysisMocks,
  },
  match: {
    params: { scannerId: 1 },
  },
  status: 'INIT',
  getScanner: jest.fn(),
}

describe('ScannerDetailPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<ScannerDetailPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(TabPane).length).toBe(2)
    expect(initialProps.getScanner).toHaveBeenCalledWith(initialProps.match.params.scannerId)
  })

  it('should render loader', () => {
    wrapper.setProps({ status: GET_SCANNER })
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render empty', () => {
    wrapper.setProps({ scanner: null })
    expect(wrapper.isEmptyRender()).toBeTruthy()
  })
})
