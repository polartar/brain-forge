import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Checkbox, Form, InputNumber } from 'antd'

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

export default class RealignForm extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  updateArrayIndex = (sourceArr, arrayName, index, value) => {
    let dest_arr = []
    for (let i = 0; i < sourceArr.length; i++) {
      if (i === index) dest_arr[i] = value
      else dest_arr[i] = sourceArr[i]
    }
    sourceArr[index] = parseFloat(value)
    this.props.setOption(arrayName, 'value', dest_arr)
  }

  arrayForm = (field, fieldName, min, max, step) => {
    return field.value.map((_item, id) => (
      <InputNumber
        key={`${fieldName}_${id}`}
        id={`${fieldName}_${id}`}
        value={field.value[id]}
        min={min}
        max={max}
        step={step}
        onChange={value => this.updateArrayIndex(field.value, fieldName, id, value)}
      />
    ))
  }

  render() {
    const { analysisOptions, readOnly } = this.props

    const {
      realign_fwhm,
      realign_interp,
      realign_quality,
      realign_register_to_mean,
      realign_separation,
      realign_wrap,
      realign_write_interp,
      realign_write_wrap,
      realign_write_mask,
      realign_write_which,
    } = analysisOptions

    return (
      <Form layout="vertical">
        <FormItem label="Realign Smoothing FWHM" {...formItemLayout}>
          <InputNumber
            id="realign_fwhm"
            value={realign_fwhm.value}
            min={1}
            max={10}
            disabled={readOnly}
            onChange={value => this.props.setOption('realign_fwhm', 'value', value)}
          />
        </FormItem>
        <FormItem label="Interpolation" {...formItemLayout}>
          <InputNumber
            id="realign_interp"
            value={realign_interp.value}
            min={1}
            max={10}
            disabled={readOnly}
            onChange={value => this.props.setOption('realign_interp', 'value', value)}
          />
        </FormItem>
        <FormItem label="Realign Quality" {...formItemLayout}>
          <InputNumber
            id="realign_quality"
            value={realign_quality.value}
            min={0}
            max={1}
            disabled={readOnly}
            onChange={value => this.props.setOption('realign_quality', 'value', value)}
          />
        </FormItem>
        <FormItem label="Register to Mean?" {...formItemLayout}>
          <Checkbox
            id="realign_register_to_mean"
            onChange={value => this.props.setOption('realign_register_to_mean', 'value', value)}
            checked={realign_register_to_mean.value}
          />
        </FormItem>
        <FormItem label="Realign Separation" {...formItemLayout}>
          <InputNumber
            id="realign_separation"
            value={realign_separation.value}
            min={0}
            max={10}
            disabled={readOnly}
            onChange={value => this.props.setOption('realign_separation', 'value', value)}
          />
        </FormItem>
        <FormItem label="Wrapping" {...formItemLayout}>
          {this.arrayForm(realign_wrap, 'realign_wrap', 0, 1, 0.1)}
        </FormItem>
        <FormItem label="Write Interpolation" {...formItemLayout}>
          <InputNumber
            id="realign_write_interp"
            value={realign_write_interp.value}
            min={5}
            max={0}
            disabled={readOnly}
            onChange={value => this.props.setOption('realign_write_interp', 'value', value)}
          />
        </FormItem>
        <FormItem label="Write Wrapping" {...formItemLayout}>
          {this.arrayForm(realign_write_wrap, 'realign_write_wrap', 0, 1, 0.1)}
        </FormItem>
        <FormItem label="Write Mask?" {...formItemLayout}>
          <Checkbox
            id="realign_write_mask"
            onChange={value => this.props.setOption('realign_write_mask', 'value', value)}
            checked={realign_write_mask.value}
          />
        </FormItem>

        <FormItem label="Images to Resclice" {...formItemLayout}>
          {this.arrayForm(realign_write_which, 'realign_write_which', 0, 1, 0.1)}
        </FormItem>
      </Form>
    )
  }
}
