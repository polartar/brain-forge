import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, InputNumber, Radio, Row } from 'antd'
import { capitalize, kebabCase, map } from 'lodash'
import {
  ICA_ALGORITHMS,
  ICA_TYPES,
  PCA_TYPES,
  BACK_RECON,
  PREPROC_TYPES,
  SCALE_TYPE,
  WHICH_ANALYSIS,
} from 'config/base'
import { Select, Option } from 'components'
import { DataFileTree } from 'components'
const { Item: FormItem } = Form
const { Group: RadioGroup } = Radio

export default class GroupICAOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
    allFiles: PropTypes.array,
    analysisType: PropTypes.object,
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

  handleTreeChange = files => {
    this.handleSetOption('mask', 'file', files)
  }

  render() {
    const { analysisOptions, readOnly, allFiles, analysisType } = this.props
    const {
      which_analysis,
      group_ica_type,
      algorithm,
      numComponents,
      group_pca_type,
      backReconType,
      preproc_type,
      numReductionSteps,
      scaleType,
      TR,
      dummy_scans,
      numWorkers,
    } = analysisOptions

    return (
      <Row>
        <Col span={24}>
          <FormItem label="Analysis Type">
            {this.renderRadioGroup(WHICH_ANALYSIS, which_analysis.value, 'which_analysis')}
          </FormItem>

          <FormItem label="ICA Type">
            {this.renderRadioGroup(ICA_TYPES, group_ica_type.value, 'group_ica_type')}
          </FormItem>

          <FormItem label="Group ICA Algorithm">
            {this.renderRadioGroup(ICA_ALGORITHMS, algorithm.value, 'algorithm')}
          </FormItem>

          {!(algorithm.value === 'GIG-ICA' || algorithm.value === 'Constrained ICA (Spatial)') && (
            <FormItem label="Number of Components">
              <InputNumber
                id="numComponents"
                value={numComponents.value}
                min={20}
                max={100}
                precision={0}
                disabled={readOnly}
                onChange={value => this.handleSetOption('numComponents', 'value', value)}
              />
            </FormItem>
          )}

          <FormItem label="Group PCA Type">
            {this.renderRadioGroup(PCA_TYPES, group_pca_type.value, 'group_pca_type')}
          </FormItem>

          <FormItem label="Back-Reconstruction Type">
            {this.renderRadioGroup(BACK_RECON, backReconType.value, 'backReconType')}
          </FormItem>

          <FormItem label="Preprocessing Type">
            {this.renderRadioGroup(PREPROC_TYPES, preproc_type.value, 'preproc_type')}
          </FormItem>

          <FormItem label="Number of Reduction Steps [1, 2]">
            <InputNumber
              id="numReductionSteps"
              value={numReductionSteps.value}
              min={1}
              max={2}
              precision={0}
              disabled={readOnly}
              onChange={value => this.handleSetOption('numReductionSteps', 'value', value)}
            />
          </FormItem>

          <FormItem label="TR">
            <InputNumber
              id="TR"
              value={TR.value}
              min={0}
              step={0.01}
              disabled={readOnly}
              onChange={value => this.handleSetOption('TR', 'value', value)}
            />
          </FormItem>

          <FormItem label="Dummy Scans">
            <InputNumber
              id="dummy_scans"
              value={dummy_scans.value}
              min={1}
              max={2}
              precision={0}
              disabled={readOnly}
              onChange={value => this.handleSetOption('dummy_scans', 'value', value)}
            />
          </FormItem>

          <FormItem label="numWorkers">
            <InputNumber
              id="numWorkers"
              value={numWorkers.value}
              min={1}
              max={2}
              precision={0}
              disabled={readOnly}
              onChange={value => this.handleSetOption('numWorkers', 'value', value)}
            />
          </FormItem>

          <FormItem label="Scale Type">{this.renderRadioGroup(SCALE_TYPE, scaleType.value, 'scaleType')}</FormItem>

          {(algorithm.value === 'GIG-ICA' || algorithm.value === 'Constrained ICA (Spatial)') && (
            <FormItem label="Select a template for Spatially Constrained ICA:">
              <Select
                defaultValue={['NeuroMark']}
                value={analysisOptions.ica_template.value}
                onChange={value => this.handleSetOption('ica_template', 'value', value)}
              >
                <Option key={0} value={'NeuroMark'}>
                  NeuroMark
                </Option>

                {map(allFiles, ({ id, name }) => (
                  <Option key={id} value={id}>
                    {name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          )}
          <FormItem label="Select a Mask Type:">
            <Select
              defaultValue={['default']}
              value={analysisOptions.mask.value}
              onChange={value => this.handleSetOption('mask', 'value', value)}
              style={{ width: '25%' }}
            >
              <Option key={0} value={'default'}>
                Default Mask
              </Option>
              <Option key={1} value={'average'}>
                Average Mask
              </Option>
              <Option key={2} value={'custom'}>
                Custom Mask
              </Option>
            </Select>
            {analysisOptions.mask.value === 'custom' && (
              <DataFileTree multiple analysisType={analysisType} onChange={this.handleTreeChange} />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}
