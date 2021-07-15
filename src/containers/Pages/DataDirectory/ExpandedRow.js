import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Empty, Table, Tooltip } from 'antd'
import { find, get } from 'lodash'
import moment from 'moment'

const ExpandedRow = props => {
  const { analyses, downloadingAnalysis, analysisTypes } = props

  if (analyses.length === 0) {
    return <Empty />
  }

  let columns = [
    {
      title: 'Analysis Type',
      key: 'analysis_type',
      render: (_, record) => get(find(analysisTypes, { id: record.analysis_type }), 'label'),
    },
    {
      title: 'Parameter Set',
      dataIndex: 'parameter_set_name',
      key: 'parameter_set_name',
      render: (text, record) => (
        <Button className="p-0" type="link" onClick={() => props.onToggleModal('paramsModal', record.id)}>
          {text}
        </Button>
      ),
    },
    { title: 'Date Started', dataIndex: 'date_time_start', key: 'date_time_start' },
    { title: 'Date Completed', dataIndex: 'date_time_end', key: 'date_time_end' },
    { title: 'Performed By', key: 'created_by', render: (_, record) => get(record, 'created_by.username') },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (text, record) => {
        if (text === 'Complete') {
          return (
            <Button size="small" type="primary" onClick={() => props.onShowResult(record)}>
              Completed
            </Button>
          )
        }

        if (text === 'Error') {
          return (
            <Button size="small" type="danger" onClick={() => props.onShowError(record.error)}>
              Error
            </Button>
          )
        }

        return text
      },
    },
  ]

  columns.push({
    title: 'Actions',
    key: 'actions',
    render: (_, record) => {
      const { id, status, error, has_figures, provenance, parameters } = record
      const completed = status === 'Complete'
      const failed = status === 'Error'

      return (
        <div className="d-flex">
          <Tooltip title="Parameters">
            <Button
              className="mr-05"
              icon="setting"
              size="small"
              shape="circle"
              onClick={() => props.onToggleModal('paramsModal', id)}
            />
          </Tooltip>
          {completed && (
            <Tooltip title="Results">
              <Link to={`/analysis/${id}/result`}>
                <Button className="mr-05" type="default" icon="eye" size="small" shape="circle" />
              </Link>
            </Tooltip>
          )}
          {completed && has_figures && (
            <Tooltip title="Download">
              <Button
                className="mr-05"
                type="default"
                icon="download"
                size="small"
                shape="circle"
                loading={record.id === downloadingAnalysis}
                disabled={!!downloadingAnalysis}
                onClick={() => props.onDownloadResult(id)}
              />
            </Tooltip>
          )}
          {failed && (
            <Tooltip title="Errors">
              <Button
                className="mr-05"
                type="danger"
                icon="exclamation-circle"
                size="small"
                shape="circle"
                onClick={() => props.onShowError(error)}
              />
            </Tooltip>
          )}
          {provenance && (
            <Tooltip title="Provenance">
              <Button
                className="mr-05"
                icon="cluster"
                size="small"
                shape="circle"
                onClick={() => props.onToggleModal('provenanceModal', id)}
              />
            </Tooltip>
          )}
          {(completed || failed) && get(parameters, 'analysis.analysis_type') && (
            <Link to={`/analysis-start/${parameters.analysis.analysis_type}?analysisId=${record.id}`}>
              <Tooltip title="Redo">
                <Button className="mr-05" icon="redo" size="small" shape="circle" />
              </Tooltip>
            </Link>
          )}
          {(completed || failed) && (
            <Tooltip title="Delete">
              <Button
                icon="delete"
                size="small"
                shape="circle"
                type="danger"
                onClick={() => props.onDeleteResult(id)}
              />
            </Tooltip>
          )}
        </div>
      )
    },
  })

  const data = analyses.map(set => ({
    ...set,
    date_time_start: moment(set.date_time_start).format('MMM Do YYYY, h:mm A'),
    date_time_end: set.date_time_end ? moment(set.date_time_end).format('MMM Do YYYY, h:mm A') : '',
  }))

  return (
    <Table
      className="data-directory-table__expanded"
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="id"
      size="small"
    />
  )
}

ExpandedRow.propTypes = {
  analyses: PropTypes.array,
  downloadingAnalysis: PropTypes.any,
  analysisTypes: PropTypes.array,
  onToggleModal: PropTypes.func,
  onDownloadResult: PropTypes.func,
  onDeleteResult: PropTypes.func,
  onShowResult: PropTypes.func,
  onShowError: PropTypes.func,
}

export default ExpandedRow
