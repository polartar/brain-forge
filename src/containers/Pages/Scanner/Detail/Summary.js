import React from 'react'
import PropTypes from 'prop-types'
import { Card, Table } from 'antd'
import { keys } from 'lodash'

const Summary = ({ summary }) => {
  const columns = keys(summary[0]).reduce((acc, key) => {
    acc.push({
      title: key,
      dataIndex: key,
      key,
      render: val => (key !== 'Metric' ? val.toFixed(2) : val),
    })

    return acc
  }, [])

  return (
    <Card className="analysis-summary">
      <div className="analysis-summary-heading">Summary Statistics</div>
      <Table dataSource={summary} columns={columns} pagination={false} size="small" rowKey="Metric" bordered />
    </Card>
  )
}

Summary.propTypes = {
  summary: PropTypes.array,
}

export default Summary
