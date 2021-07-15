import React from 'react'
import PropTypes from 'prop-types'
import ReactJson from 'react-json-view'
import { Alert } from 'antd'
import { Loader } from 'components'

const ScanParamsTab = ({ loading, error, data }) => {
  if (loading) {
    return <Loader />
  }

  if (error) {
    return <Alert message={error} type="error" showIcon />
  }

  return <ReactJson src={data} displayDataTypes={false} displayObjectSize={false} theme="monokai" />
}

ScanParamsTab.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.string,
  data: PropTypes.object,
}

export default ScanParamsTab
