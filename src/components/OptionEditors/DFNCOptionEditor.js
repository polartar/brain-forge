import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, InputNumber, Radio, Row, Checkbox } from 'antd'
import { capitalize, kebabCase, map } from 'lodash'
import { DISTANCE_METHODS } from 'config/base'

const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

export default class DFNCOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  handleSetOption = (optionName, parameterName, value) => {
    const { setAnalysisOption } = this.props
    setAnalysisOption &&
      setAnalysisOption({
        name: optionName,
        option: { [parameterName]: value },
      })
  }

  renderRadioGroup = (arr, item, name) => (
    <RadioGroup
      onChange={evt => this.handleSetOption(name, 'value', evt.target.value)}
      value={item}
      disabled={this.props.readOnly}
      style={{ width: '100%' }}
    >
      <Row>
        {map(arr, value => (
          <Col md={6} key={kebabCase(value)}>
            <Radio value={value}>{capitalize(value)}</Radio>
          </Col>
        ))}
      </Row>
    </RadioGroup>
  )

  render() {
    const { analysisOptions } = this.props
    const {
      kmeans_max_iter,
      dmethod,
      TR,
      tc_detrend,
      tc_despike,
      tc_filter,
      wsize,
      window_alpha,
      num_clusters,
    } = analysisOptions

    return (
      <Row>
        <Col span={24}>
          <FormItem label="Clustering: Maximum Iterations">
            <InputNumber
              id="kmeans_max_iter"
              value={kmeans_max_iter.value}
              min={1}
              max={1024}
              precision={0}
              onChange={value => this.handleSetOption('kmeans_max_iter', 'value', value)}
            />
          </FormItem>

          <FormItem label="Clustering: Distance Metric">
            {this.renderRadioGroup(DISTANCE_METHODS, dmethod.value, 'dmethod')}
          </FormItem>

          <FormItem label="Window Size">
            <InputNumber
              id="wsize"
              value={wsize.value}
              min={1}
              max={150}
              precision={0}
              onChange={value => this.handleSetOption('wsize', 'value', value)}
            />
          </FormItem>

          <FormItem label="Temporal Resolution">
            <InputNumber
              id="TR"
              value={TR.value}
              min={1}
              max={5}
              precision={0}
              onChange={value => this.handleSetOption('TR', 'value', value)}
            />
          </FormItem>

          <FormItem label="Number of Temporal Trends to Remove">
            <InputNumber
              id="tc_detrend"
              value={tc_detrend.value}
              min={0}
              max={3}
              precision={0}
              onChange={value => this.handleSetOption('tc_detrend', 'value', value)}
            />
          </FormItem>

          <FormItem label="Remove Spikes from Time Courses">
            <Checkbox
              checked={tc_despike.value === 'yes'}
              onChange={evt => this.handleSetOption('tc_despike', 'value', evt.target.checked ? 'yes' : 'no')}
            />
          </FormItem>

          <FormItem label="High Frequency Cutoff">
            <InputNumber
              id="tc_filter"
              step="0.01"
              value={tc_filter.value}
              min={0}
              max={1}
              precision={2}
              onChange={value => this.handleSetOption('tc_filter', 'value', value)}
            />
          </FormItem>

          <FormItem label="Gaussian Window alpha Value">
            <InputNumber
              id="window_alpha"
              value={window_alpha.value}
              min={0}
              max={5}
              precision={0}
              onChange={value => this.handleSetOption('window_alpha', 'value', value)}
            />
          </FormItem>

          <FormItem label="Clustering: Number of Clusters">
            <InputNumber
              id="num_clusters"
              value={num_clusters.value}
              min={1}
              max={99}
              precision={0}
              onChange={value => this.handleSetOption('num_clusters', 'value', value)}
            />
          </FormItem>
        </Col>
      </Row>
    )
  }
}
