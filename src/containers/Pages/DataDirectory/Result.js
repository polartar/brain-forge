import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Card } from 'antd'
import { AnalysisResultSummary, Loader } from 'components'
import { ANALYSIS_RESULTS, SOCKET_PATH } from 'config/base'
import { renderErrors } from 'utils/analyses'

export default class AnalysisResut extends Component {
  static propTypes = {
    id: PropTypes.number,
    dataFile: PropTypes.object,
  }

  socket = null

  state = {
    status: null,
    output: null,
  }

  componentDidMount() {
    this.createSocket()
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }

  createSocket = () => {
    const { id } = this.props
    const url = `${SOCKET_PATH}/ws/analysis/${id}/`

    const socket = new WebSocket(url)
    socket.onmessage = this.handleMessageReceived

    this.socket = socket
  }

  handleMessageReceived = message => {
    const { status, output } = JSON.parse(message.data)
    this.setState({ status, output })
  }

  renderContent = () => {
    const { id, dataFile } = this.props
    const { status, output } = this.state

    switch (status) {
      case ANALYSIS_RESULTS.Complete:
        return (
          <Card>
            <AnalysisResultSummary id={id} data={output} dataFile={dataFile} />
          </Card>
        )
      case ANALYSIS_RESULTS.ReadyToRun:
      case ANALYSIS_RESULTS.Pending:
      case ANALYSIS_RESULTS.Running:
        return <Alert message={output} type="info" showIcon banner />

      case ANALYSIS_RESULTS.Error:
        return renderErrors(output)
      default:
        return <Loader />
    }
  }

  render() {
    return <div>{this.renderContent()}</div>
  }
}
