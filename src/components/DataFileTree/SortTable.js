import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { get, isEmpty } from 'lodash'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { MenuOutlined } from '@ant-design/icons'

export const SortTable = props => {
  const { selectedFiles, onChange } = props

  const data = selectedFiles
    ? selectedFiles.map((selectedFile, index) => ({
        dataFile: get(selectedFile, 'name'),
        series: get(selectedFile, 'series_info.label'),
        subject: get(selectedFile, 'subject_info.anon_id'),
        session: get(selectedFile, 'session_info.segment_interval'),
        index,
      }))
    : []

  const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />)

  const columns = [
    {
      title: 'Sort',
      dataIndex: 'sort',
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: 'DataFile',
      dataIndex: 'dataFile',
      className: 'drag-visible',
    },
    {
      title: 'Series',
      dataIndex: 'series',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      title: 'Session',
      dataIndex: 'session',
    },
  ]

  const SortableItem = sortableElement(props => <tr {...props} />)
  const SortableContainer = sortableContainer(props => <tbody {...props} />)

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      onChange(oldIndex, newIndex)
    }
  }

  const DraggableContainer = props => (
    <SortableContainer useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />
  )

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = data.findIndex(x => x.index === restProps['data-row-key'])
    return <SortableItem index={index} {...restProps} />
  }

  return (
    !isEmpty(data) && (
      <Table
        dataSource={data}
        columns={columns}
        tableLayout="auto"
        scroll={{ x: 900 }}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '30', '40', '50'],
        }}
      />
    )
  )
}

SortTable.propTypes = {
  selectedKeys: PropTypes.array,
  selectedFiles: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  onChange: PropTypes.func,
}

export default SortTable
