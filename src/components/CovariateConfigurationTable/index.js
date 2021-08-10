import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Table, Select } from 'antd'
import { filter, forEach, map } from 'lodash'
import { VARIABLE_EFFECTS, COVARIATE_VARIABLE_ROLES, COVARIATE_VARIABLE_TYPES, TRANSFORMATION_TYPES } from 'config/base'
const { Option } = Select
export default class CovariateConfigurationTable extends Component {
  static propTypes = {
    className: PropTypes.string,
    file: PropTypes.object,
    readOnly: PropTypes.bool,
    toggleAllCurrentFilesField: PropTypes.func,
    updateCurrentFilesField: PropTypes.func,
  }

  static defaultProps = {
    className: 'mb-4',
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
        title: 'Select Variable Interactions',
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
    ]

    return columns
  }

  get data() {
    const { file } = this.props

    let data = []

    forEach(file.fields, ({ index, name, transformation, variable_type }) => {
      const buttonProps = {
        type: 'ghost',
        size: 'small',
      }

      let interactions = [name]

      map(file.fields, (field, index) => {
        if (name !== field.name && field.selected) interactions.push(name + ' X ' + field.name)
      })

      data.push({
        key: index,
        name,
        selectResponse: (
          <Select
            mode="multiple"
            defaultValue={[]}
            style={{ width: '100%' }}
            options={interactions}
            onChange={e => {
              this.handleUpdateCurrentFilesField({
                index,
                field: { variable_interactions: { interaction: e } },
              })
            }}
          >
            {map(interactions, (interaction, index) => (
              <Option key={index} value={interaction}>
                {interaction}
              </Option>
            ))}
          </Select>
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
            {COVARIATE_VARIABLE_TYPES[variable_type].label}
          </Button>
        ),
      })
    })

    return data
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
        scroll: { x: true },
      },
      !readOnly && {
        title: () => `Configure covariates for ${file.name} (click to toggle)`,
        rowSelection: {
          selectedRowKeys,
          onSelectAll: this.handleToggleAll,
          onSelect: this.handleSelect,
        },
      },
    )
  }

  handleUpdateCurrentFilesField = value => {
    const { updateCurrentFilesField } = this.props

    updateCurrentFilesField && updateCurrentFilesField(value)
  }

  handleVariableTypeChange = (type, index, value) => {
    const VARIABLE_CONSTANTS = {
      variable_role: COVARIATE_VARIABLE_ROLES,
      transformation: TRANSFORMATION_TYPES,
      variable_type: COVARIATE_VARIABLE_TYPES,
      effect: VARIABLE_EFFECTS,
    }

    this.handleUpdateCurrentFilesField({
      index,
      field: { [type]: VARIABLE_CONSTANTS[type][value].next },
    })
  }

  handleToggleAll = selected => {
    const { toggleAllCurrentFilesField } = this.props
    toggleAllCurrentFilesField && toggleAllCurrentFilesField(selected)
  }

  handleSelect = (record, selected) => {
    const { key } = record
    this.handleUpdateCurrentFilesField({ index: key, field: { selected } })
  }

  handleInteractions = (record, interaction, val) => {
    const { key } = record
    this.handleUpdateCurrentFilesField({ index: key, field: { variable_role: { interaction } } })
  }

  render() {
    return this.data.length > 0 ? <Table {...this.tableProps} /> : null
  }
}