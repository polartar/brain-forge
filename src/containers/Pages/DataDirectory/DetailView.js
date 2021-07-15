import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Tabs } from 'antd'
import { get } from 'lodash'
import { parseError } from 'utils/error-parser'
import DataFileTab from './DataFileTab'
import ScanParamsTab from './ScanParamsTab'

const { TabPane } = Tabs

class DetailView extends Component {
  static propTypes = {
    datafile: PropTypes.object.isRequired,
  }

  state = {
    scanParamsData: null,
    error: null,
    loading: false,
  }

  async componentWillMount() {
    const { datafile } = this.props

    await this.getScanParameters(datafile.id)
  }

  getScanParameters = async id => {
    this.setState({ scanParamsData: null, error: null, loading: true })

    try {
      const { data } = await axios.get(`/data-directory/${id}/scan_params/`)
      /* istanbul ignore next */
      this.setState({ scanParamsData: data, loading: false })
    } catch (error) {
      /* istanbul ignore next */
      this.setState({
        loading: false,
        error: get(parseError(error), 'message', 'Failed to get scan parameters'),
      })
    }
  }

  render() {
    const { datafile } = this.props
    const { scanParamsData, loading, error } = this.state

    return (
      <Tabs animated={false}>
        <TabPane tab="File" key="file">
          <DataFileTab dataFile={datafile} />
        </TabPane>
        <TabPane tab="Scan Parameters" key="scan-parameters">
          <ScanParamsTab data={scanParamsData} loading={loading} error={error} l />
        </TabPane>
      </Tabs>
    )
  }
}

export default DetailView
