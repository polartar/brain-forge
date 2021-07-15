import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Radio, Select } from 'antd'
import { find, get, isNumber } from 'lodash'
import { SITE_ROLES } from 'config/base'

const { Option } = Select

const EditTableCell = props => {
  const { value, editable, field, isLoading, onChange, input, selects } = props

  const [editValue, setEditValue] = useState(value)
  const [hoverEdit, setHoverEdit] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const getField = () => {
    if (input === 'selectRadio') {
      return (
        <Radio.Group onChange={event => setEditValue(event.target.value)} value={editValue}>
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      )
    } else if (input === 'select') {
      return (
        selects && (
          <Select onChange={value => setEditValue(value)} defaultValue={value}>
            {selects.map((select, index) => (
              <Option key={index} value={select.value}>
                {select.text}
              </Option>
            ))}
          </Select>
        )
      )
    } else {
      return <Input size="small" value={editValue} onChange={event => setEditValue(event.target.value)} />
    }
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    setEditValue(value)
  }

  const handleSubmit = () => {
    setIsEditing(false)
    onChange(editValue)
  }

  const getEditTable = () => {
    if (field === 'site_role' && isNumber(editValue)) {
      const userSiteRole = find(SITE_ROLES, { value: editValue })
      return get(userSiteRole, 'text')
    }
    if (input === 'selectRadio') {
      return editValue ? 'Yes' : 'No'
    }
    return editValue
  }

  if (isEditing) {
    return (
      <div className="d-flex align-items-center">
        {getField()}
        <Button
          id="submit"
          className="m-02"
          shape="circle"
          icon="check"
          size="small"
          disabled={isLoading}
          onClick={handleSubmit}
        />
        <Button
          id="close"
          className="m-02"
          shape="circle"
          icon="close"
          size="small"
          disabled={isLoading}
          onClick={handleCancelEditing}
        />
      </div>
    )
  }

  return (
    <div
      className="d-flex align-items-center"
      onMouseEnter={() => setHoverEdit(true)}
      onMouseLeave={() => setHoverEdit(false)}
    >
      {getEditTable()}
      {editable && hoverEdit && (
        <Button
          style={{ marginLeft: 5 }}
          id="edit-btn"
          shape="circle"
          icon="edit"
          size="small"
          onClick={() => setIsEditing(true)}
        />
      )}
    </div>
  )
}

EditTableCell.propTypes = {
  selects: PropTypes.array,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number]),
  input: PropTypes.string,
  field: PropTypes.string,
  editable: PropTypes.bool,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
}

EditTableCell.defaultProps = {
  value: '',
  input: '',
  field: '',
}

export default EditTableCell
