import React from 'react'
import PropTypes from 'prop-types'
import { Descriptions, Tag, Alert } from 'antd'
import { get } from 'lodash'

const { Item } = Descriptions

const FileInfo = ({ dataFile }) => {
  if (!dataFile) {
    return <Alert type="info" message="No File" showIcon />
  }

  return (
    <Descriptions bordered column={1} size="small">
      <Item label="Name">{dataFile.name}</Item>
      <Item label="Study">{get(dataFile, 'study_info.full_name')}</Item>
      <Item label="Site">{get(dataFile, 'site_info.full_name')}</Item>
      <Item label="PI">
        <Tag>{get(dataFile, 'pi_info.username')}</Tag>
      </Item>
      <Item label="Scanner">{get(dataFile, 'scanner_info.full_name')}</Item>
      <Item label="Modality">{get(dataFile, 'series.modality.full_name')}</Item>
      <Item label="Subject">{get(dataFile, 'subject_info.anon_id')}</Item>
      <Item label="Session">{get(dataFile, 'session_info.segment_interval')}</Item>
      <Item label="Series">{get(dataFile, 'series_info.label')}</Item>
      <Item label="Path">
        <span className="word-break-all">{dataFile.path || ''}</span>
      </Item>
      <Item label="Format">{dataFile.format || ''}</Item>
      <Item label="Files">
        {dataFile.files.map((file, ind) => (
          <Tag key={ind}>{file}</Tag>
        ))}
      </Item>
      <Item label="Uploaded by">
        <Tag>{dataFile.uploaded_by}</Tag>
      </Item>
    </Descriptions>
  )
}

FileInfo.propTypes = {
  dataFile: PropTypes.object,
}

export default FileInfo
