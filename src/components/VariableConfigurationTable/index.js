import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Table } from 'antd'
import { filter, forEach, map } from 'lodash'
import { VARIABLE_EFFECTS, VARIABLE_ROLES, VARIABLE_TYPES, TRANSFORMATION_TYPES } from 'config/base'

export default class VariableConfigurationTable extends Component {
  static propTypes = {
    className: PropTypes.string,
    file: PropTypes.object,
    readOnly: PropTypes.bool,
    toggleAllCurrentFilesField: PropTypes.func,
    updateCurrentFilesField: PropTypes.func,
  }

  static defaultProps = {
    className: 'mb-2',
    readOnly: false,
  }

  get columns() {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Select Response',
        dataIndex: 'selectResponse',
        key: 'selectResponse',
      },
      {
        title: 'Transformation',
        dataIndex: 'transformation',
        key: 'transformation',
      },
      {
        title: 'Variable Type',
        dataIndex: 'variableType',
        key: 'variableType',
      },
      {
        title: 'Effect Type',
        dataIndex: 'effectType',
        key: 'effectType',
      },
    ]

    return columns
  }

  get data() {
    const { file } = this.props
    const roleNames = { x: 'Feature', y: 'Response' }
    let data = []
    forEach(file.fields, ({ index, name, variable_role, transformation, variable_type, effect }) => {
      const buttonProps = {
        type: 'ghost',
        size: 'small',
      }

      data.push({
        key: index,
        name,
        selectResponse: (
          <Button
            {...buttonProps}
            onClick={() => {
              this.handleVariableTypeChange('variable_role', index, variable_role)
            }}
          >
            {roleNames[VARIABLE_ROLES[variable_role].label]}
          </Button>
        ),
        transformation: (
          <Button
            {...buttonProps}
            onClick={() => {
              this.handleVariableTypeChange('transformation', index, transformation)
            }}
          >
            {TRANSFORMATION_TYPES[transformation].label}
          </Button>
        ),
        variableType: (
          <Button
            {...buttonProps}
            onClick={() => {
              this.handleVariableTypeChange('variable_type', index, variable_type)
            }}
          >
            {VARIABLE_TYPES[variable_type].label}
          </Button>
        ),
        effectType: (
          <Button
            {...buttonProps}
            onClick={() => {
              this.handleVariableTypeChange('effect', index, effect)
            }}
          >
            {VARIABLE_EFFECTS[effect].label}
          </Button>
        ),
      })
    })

    return data
  }

  handleVariableTypeChange = (type, index, value) => {
    const { updateCurrentFilesField } = this.props

    const VARIABLE_CONSTANTS = {
      variable_role: VARIABLE_ROLES,
      transformation: TRANSFORMATION_TYPES,
      variable_type: VARIABLE_TYPES,
      effect: VARIABLE_EFFECTS,
    }

    updateCurrentFilesField &&
      updateCurrentFilesField({
        index,
        field: { [type]: VARIABLE_CONSTANTS[type][value].next },
      })
  }

  handleToggleAll = selected => {
    const { toggleAllCurrentFilesField } = this.props

    toggleAllCurrentFilesField && toggleAllCurrentFilesField(selected)
  }

  handleSelect = (record, selected) => {
    const { updateCurrentFilesField } = this.props
    const { key } = record

    updateCurrentFilesField && updateCurrentFilesField({ index: key, field: { selected } })
  }

  get tableProps() {
    const { readOnly, file, className } = this.props
    const selectedFields = filter(file.fields, 'selected')
    const selectedRowKeys = map(selectedFields, 'index')

    return Object.assign(
      {},
      {
        dataSource: this.data,
        columns: this.columns,
        size: 'small',
        pagination: false,
        bordered: true,
        className,
      },
      !readOnly && {
        title: () => `Specify variable types for ${file.name} (click to toggle)`,
        rowSelection: {
          selectedRowKeys,
          onSelectAll: this.handleToggleAll,
          onSelect: this.handleSelect,
        },
      },
    )
  }

  render() {
    return this.data.length > 0 ? <Table {...this.tableProps} /> : null
  }
}
