import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Input, Row } from 'antd'
import { get, map } from 'lodash'
import { getParameterLayouts } from 'utils/common'
import { Select, Option } from 'components'
import { SLURM_PARTITIONS, SLURM_DEFAULT_PARTITION } from 'config/base'

const { Item: FormItem } = Form

export default class OptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
    fullWidth: PropTypes.bool,
  }

  static defaultProps = {
    readOnly: false,
    fullWidth: false,
  }

  handleNameChange = evt => {
    const { setAnalysisOption } = this.props
    const { value } = evt.target

    setAnalysisOption && setAnalysisOption({ name: 'name', option: { value } })
  }

  handleDescriptionChange = evt => {
    const { setAnalysisOption } = this.props
    const { value } = evt.target

    setAnalysisOption && setAnalysisOption({ name: 'description', option: { value } })
  }

  handleAnalysisOptionChange = (name, value) => {
    this.props.setAnalysisOption({ name, option: { value } })
  }

  render() {
    const { analysisOptions, readOnly, fullWidth } = this.props
    const { name, description } = analysisOptions

    const { formLayout, gridLayout } = getParameterLayouts(fullWidth)

    return (
      <Row>
        <Col {...gridLayout}>
          <FormItem label="Enter a name:" {...formLayout}>
            <Input className="name" value={get(name, 'value')} onChange={this.handleNameChange} disabled={readOnly} />
          </FormItem>
          <FormItem className="description" label="Description:" {...formLayout}>
            <Input value={get(description, 'value')} onChange={this.handleDescriptionChange} disabled={readOnly} />
          </FormItem>
          <FormItem className="slurmPartition" label="Slurm Partition:" {...formLayout}>
            <Select
              defaultValue={SLURM_DEFAULT_PARTITION}
              value={get(analysisOptions, 'slurm_partition.value', SLURM_DEFAULT_PARTITION)}
              onChange={value => this.handleAnalysisOptionChange('slurm_partition', value)}
            >
              {map(SLURM_PARTITIONS, partition => (
                <Option key={partition} value={partition}>
                  {partition}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Col>
      </Row>
    )
  }
}
