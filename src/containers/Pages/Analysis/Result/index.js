import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Card } from 'antd'
import { ANALYSIS_RESULTS, SOCKET_PATH } from 'config/base'
import { PageLayout } from 'containers/Layouts'
import { AnalysisResultSummary, Loader } from 'components'
import { renderErrors } from 'utils/analyses'

export default class AnalysisResultPage extends Component {
  static propTypes = {
    match: PropTypes.object,
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
    const { match } = this.props
    const url = `${SOCKET_PATH}/ws/analysis/${match.params.analysisId}/`

    const socket = new WebSocket(url)
    socket.onmessage = this.handleMessageReceived

    this.socket = socket
  }

  handleMessageReceived = message => {
    const { status, output, data_file } = JSON.parse(message.data)
    this.setState({ status, output, dataFile: data_file })
  }

  renderContent = () => {
    const { analysisId } = this.props.match.params
    const { status, output, dataFile } = this.state

    switch (status) {
      case ANALYSIS_RESULTS.Complete:
        return (
          <Card>
            <AnalysisResultSummary id={parseInt(analysisId, 10)} data={output} dataFile={dataFile} />
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
    return <PageLayout heading="Analysis Result Summary">{this.renderContent()}</PageLayout>
  }
}
