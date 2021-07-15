import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { endsWith } from 'lodash'

const FilesView = ({ dataFiles }) => {
  const allFiles = useMemo(() => {
    return dataFiles
      .reduce((acc, dataFile) => {
        acc = acc.concat(
          dataFile.files
            .filter(fileName => !endsWith(fileName, '.json'))
            .map(fileName => `${dataFile.path}/${fileName}`),
        )
        return acc
      }, [])
      .map((file, idx) => ({ order: idx, file }))
  }, [dataFiles])

  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
      render: text => <div className="word-break-all">{text}</div>,
    },
  ]

  return <Table columns={columns} dataSource={allFiles} bordered rowKey="order" size="small" />
}

FilesView.propTypes = {
  dataFiles: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      files: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
}

export default FilesView
