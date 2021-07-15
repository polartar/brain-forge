import React from 'react'
import { shallow } from 'enzyme'
import { Alert } from 'antd'
import { AnalysisResultSummary, Loader } from 'components'
import { ANALYSIS_RESULTS } from 'config/base'
import AnalysisResultPage from './index'

const initialProps = {
  match: {
    params: { analysisId: 1 },
  },
}

describe('AnalysisResultPage', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallow(<AnalysisResultPage {...initialProps} />)
  })

  it('should render component', () => {
    expect(wrapper.find(Loader).length).toBe(1)
  })

  it('should render result', () => {
    let state = { status: ANALYSIS_RESULTS.Complete, output: {} }
    wrapper.setState(state)
    expect(wrapper.find(AnalysisResultSummary).length).toBe(1)

    state = { status: ANALYSIS_RESULTS.ReadyToRun, output: 'Ready to run' }
    wrapper.setState(state)
    expect(wrapper.find(Alert).props().message).toBe(state.output)

    state = { status: ANALYSIS_RESULTS.Pending, output: 'Pending' }
    wrapper.setState(state)
    expect(wrapper.find(Alert).props().message).toBe(state.output)

    state = { status: ANALYSIS_RESULTS.Running, output: 'Running' }
    wrapper.setState(state)
    expect(wrapper.find(Alert).props().message).toBe(state.output)

    state = { status: ANALYSIS_RESULTS.Error, output: 'Error:::error description;;;' }
    wrapper.setState(state)
    expect(wrapper.find(Alert).props().type).toBe('error')
    expect(wrapper.find(Alert).props().message).toBe('Error')
    expect(wrapper.find(Alert).props().description).toBe('error description')

    wrapper.unmount()
  })

  it('should set socket', () => {
    const socket = wrapper.instance().socket
    const res = { status: ANALYSIS_RESULTS.Running, output: 'Running' }
    socket.onmessage({ data: JSON.stringify(res) })
    expect(wrapper.state()).toEqual(res)

    wrapper.instance().socket = null
    wrapper.unmount()
  })
})
