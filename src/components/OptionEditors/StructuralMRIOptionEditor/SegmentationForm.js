import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Checkbox } from 'antd'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

export default class SegmentationForm extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  updateArrayIndex = (source_arr, array_name, index, value) => {
    let dest_arr = []
    for (let i = 0; i < source_arr.length; i++) {
      if (i === index) dest_arr[i] = value
      else dest_arr[i] = source_arr[i]
    }
    source_arr[index] = parseFloat(value)

    this.props.setOption(array_name, 'value', dest_arr)
  }

  arrayForm = (field, field_name, min, max, step) => {
    return field.value.map((_item, id) => (
      <InputNumber
        key={`${field_name}_${id}`}
        id={`${field_name}_${id}`}
        value={field.value[id]}
        min={min}
        max={max}
        step={step}
        onChange={value => this.updateArrayIndex(field.value, field_name, id, value)}
      />
    ))
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const {
      BIAS_REGULARIZATION,
      FWHM_GAUSSIAN_SMOOTH_BIAS,
      affine_regularization,
      warping_regularization,
      sampling_distance,
      mrf_weighting,
      cleanup,
      smoothing_implicit_masking,
    } = analysisOptions

    return (
      <Form layout="vertical">
        <FormItem label="Bias regularization options [Extremely light-Very heavy]" {...formItemLayout}>
          <Select
            id="BIAS_REGULARIZATION"
            value={BIAS_REGULARIZATION.value}
            onChange={value => this.props.setOption('BIAS_REGULARIZATION', 'value', value)}
          >
            <Option value={0}>None (0)</Option>
            <Option value={0.00001}>Extremely Light (0.00001)</Option>
            <Option value={0.0001}>Very Light (0.0001)</Option>
            <Option value={0.001}>Light (0.001)</Option>
            <Option value={0.01}>Medium (0.01)</Option>
            <Option value={0.1}>Heavy (0.1)</Option>
            <Option value={1}>Very Heavy (1.0)</Option>
            <Option value={10}>Very Heavy (10.0)</Option>
          </Select>
        </FormItem>
        <FormItem label="FWHM_GAUSSIAN_SMOOTH_BIAS(mm)" {...formItemLayout}>
          <InputNumber
            id="FWHM_GAUSSIAN_SMOOTH_BIAS"
            value={FWHM_GAUSSIAN_SMOOTH_BIAS.value}
            min={0}
            step={0.0001}
            max={10}
            disabled={readOnly}
            onChange={value => this.props.setOption('FWHM_GAUSSIAN_SMOOTH_BIAS', 'value', value)}
          />
        </FormItem>
        <FormItem label="Affine Regularization" {...formItemLayout}>
          <Select
            id="affine_regularization"
            value={affine_regularization.value}
            onChange={value => this.props.setOption('affine_regularization', 'value', value)}
          >
            <Option value="mni">MNI</Option>
            <Option value="eastern">Eastern</Option>
            <Option value="subj">Subject</Option>
            <Option value="none">None</Option>
          </Select>
        </FormItem>
        <FormItem label="Warping Regularization" {...formItemLayout}>
          {this.arrayForm(warping_regularization, 'warping_regularization', 0, 1, 0.1)}
        </FormItem>
        <FormItem label="Sampling Distance" {...formItemLayout}>
          <InputNumber
            id="sampling_distance"
            value={sampling_distance.value}
            min={0}
            step={0.0001}
            max={10}
            disabled={readOnly}
            onChange={value => this.props.setOption('sampling_distance', 'value', value)}
          />
        </FormItem>
        <FormItem label="Markov Random Field Weighting" {...formItemLayout}>
          <InputNumber
            id="mrf_weighting"
            value={mrf_weighting.value}
            min={0}
            step={0.0001}
            max={10}
            disabled={readOnly}
            onChange={value => this.props.setOption('mrf_weighting', 'value', value)}
          />
        </FormItem>
        <FormItem label="Cleanup" {...formItemLayout}>
          <InputNumber
            id="cleanup"
            value={cleanup.value}
            min={0}
            max={2}
            disabled={readOnly}
            onChange={value => this.props.setOption('cleanup', 'value', value)}
          />
        </FormItem>
        <FormItem label="Implicit Masking?" {...formItemLayout}>
          <Checkbox
            id="smoothing_implicit_masking"
            checked={smoothing_implicit_masking.value}
            onChange={value => this.props.setOption('smoothing_implicit_masking', 'value', value)}
          >
            Implicit Masking
          </Checkbox>
        </FormItem>
      </Form>
    )
  }
}
