import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { forEach, map, reduce } from 'lodash'

export default class AnalysisResultSummaryTable extends Component {
  static propTypes = {
    content: PropTypes.array,
  }

  get columns() {
    const { content } = this.props
    const columns = map(content[0], (item, ind) => ({ title: `h${ind}`, dataIndex: `h${ind}`, key: `h${ind}` }))

    return columns
  }

  get data() {
    const { content } = this.props

    let data = []

    forEach(content, (elem, rInd) => {
      const row = reduce(
        elem,
        (rowData, column, cInd) => {
          rowData[`h${cInd}`] = column
          return rowData
        },
        { key: rInd },
      )
      data.push(row)
    })

    return data
  }

  render() {
    const { content } = this.props

    if (!content || content.length === 0) {
      return null
    }

    return (
      <Table
        columns={this.columns}
        dataSource={this.data}
        pagination={false}
        showHeader={false}
        size="small"
        bordered
      />
    )
  }
}
