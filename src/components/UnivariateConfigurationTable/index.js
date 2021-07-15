import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Table, Select, Checkbox } from 'antd'
import { filter, forEach, map } from 'lodash'
import { VARIABLE_EFFECTS, COVARIATE_VARIABLE_ROLES, COVARIATE_VARIABLE_TYPES, TRANSFORMATION_TYPES } from 'config/base'
const { Option } = Select
export default class UnivariateConfigurationTable extends Component {
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
        title: 'Univariate Regression',
        dataIndex: 'regression',
        key: 'regression',
      },
      {
        title: 'One-Sample T-Test',
        dataIndex: 't_test',
        key: 't_test',
      },
      {
        title: 'Two-Sample T-Test',
        dataIndex: 't_test_twosample',
        key: 't_test_twosample',
      },
      {
        title: 'Select Nuisance Variables',
        dataIndex: 'selectNuisance',
        key: 'selectNuisance',
      },
      {
        title: 'Select Paired Regressors',
        dataIndex: 'selectTwoTailed',
        key: 'selectTwoTailed',
      },
      {
        title: 'Select Groups',
        dataIndex: 'selectLabels',
        key: 'selectLabels',
      },
    ]

    return columns
  }

  get data() {
    const { file } = this.props

    let data = []

    forEach(
      file.fields,
      ({ index, name, variable_paired_univariate, variable_ttest, variable_ttest_twosample, variable_regression, data_labels, data_unique }) => {
        const buttonProps = {
          type: 'ghost',
          size: 'small',
        }

        let variable_names = []

        map(file.fields, field => {
          if (name !== field.name && field.selected) variable_names.push(field.name)

        })

        let interactions = []

        map(file.fields, field => {
          if (name !== field.name && field.selected) interactions.push(name + ' X ' + field.name)
        })

        data.push({
          key: index,
          name,
          regression: (
            <Checkbox
              {...buttonProps}
              onClick={() => {
                this.handleUpdateCurrentFilesField({
                  index,
                  field: { variable_regression: !variable_regression },
                })
                if (!variable_regression) {
                  this.handleUnsetTwoSampleTTest()
                  this.handleUnsetTTest()
                }
              }}
              checked={variable_regression}
            />
          ),
          t_test: (
            <Checkbox
              {...buttonProps}
              onClick={() => {
                this.handleUpdateCurrentFilesField({
                  index,
                  field: { variable_ttest: !variable_ttest },
                })
                if (!variable_ttest) {
                  this.handleUnsetPairedUnivariate()
                  this.handleUnsetTwoSampleTTest()
                  this.handleUnsetRegression()
                  this.handleUnsetTTest(index)
                }
              }}
              checked={variable_ttest}
            />
          ),
          t_test_twosample: (
            <Checkbox
              {...buttonProps}
              onClick={e => {
                this.handleUpdateCurrentFilesField({
                  index,
                  field: { variable_ttest_twosample: !variable_ttest_twosample },
                })
                if (!variable_ttest_twosample) {
                  this.handleUnsetPairedUnivariate()
                  this.handleUnsetTTest()
                  this.handleUnsetRegression()
                  this.handleUnsetTwoSampleTTest(index)
                }
              }}
              checked={variable_ttest_twosample}
            />
          ),
          selectNuisance: (
            <Select
              mode="multiple"
              defaultValue={[]}
              style={{ width: '100%' }}
              options={variable_names}
              onChange={e => {
                this.handleUpdateCurrentFilesField({
                  index,
                  field: { variable_nuisance: e },
                })
              }}
            >
              {map(variable_names, (interaction, index) => (
                <Option key={index} value={interaction}>
                  {interaction}
                </Option>
              ))}
            </Select>
          ),
          selectTwoTailed: (
            <Select
              mode="multiple"
              defaultValue={[]}
              style={{ width: '100%' }}
              value={variable_paired_univariate}
              onChange={e => {
                this.handleUpdateCurrentFilesField({
                  index,
                  field: { variable_paired_univariate: e },
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
          selectLabels: (
            <Select
              mode="multiple"
              defaultValue={[]}
              style={{ width: '100%' }}
              options={Object.keys(data_labels)}
              onChange={e => {
                this.handleUpdateCurrentFilesField({
                  index,
                  field: { selected_labels: e },
                })
              }}
            >
              {map(Object.keys(data_labels), (data_label, index) => (
                <Option key={index} value={data_label}>
                  {data_label}
                </Option>
              ))}
            </Select>
          ),
        })
      },
    )

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
      },
      !readOnly && {
        title: () =>
          `Configure univariate analyses for ${file.name}. One of the following may be selected: Univariate Regression, One-Sample T-Tests, or Two-Sample T-Tests. Only one variable may be run at a time for t-tests. Multiple variables and paired regressors/nuisance varaibles`,
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

  handleUnsetTTest = refIndex => {
    const { file } = this.props
    forEach(file.fields, ({ index }) => {
      if (refIndex === undefined || index !== refIndex) {
        this.handleUpdateCurrentFilesField({
          index,
          field: { variable_ttest: false },
        })
      }
    })
  }

  handleUnsetRegression = refIndex => {
    const { file } = this.props
    forEach(file.fields, ({ index }) => {
      if (refIndex === undefined || index !== refIndex) {
        this.handleUpdateCurrentFilesField({
          index,
          field: { variable_regression: false },
        })
      }
    })
  }

  handleUnsetTwoSampleTTest = refIndex => {
    const { file } = this.props
    forEach(file.fields, ({ index }) => {
      if (refIndex === undefined || index !== refIndex) {
        this.handleUpdateCurrentFilesField({
          index,
          field: { variable_ttest_twosample: false },
        })
      }
    })
  }

  handleUnsetPairedUnivariate = refIndex => {
    const { file } = this.props
    forEach(file.fields, ({ index }) => {
      if (refIndex === undefined || index !== refIndex) {
        this.handleUpdateCurrentFilesField({
          index,
          field: { variable_paired_univariate: [] },
        })
      }
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
    this.handleUpdateCurrentFilesField({ index: key, field: { variable_interactions: { interaction } } })
  }

  render() {
    return this.data.length > 0 ? <Table {...this.tableProps} /> : null
  }
}
