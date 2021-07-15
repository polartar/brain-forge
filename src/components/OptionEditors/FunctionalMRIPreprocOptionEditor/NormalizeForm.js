import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Row } from 'antd'
import { Select, Option } from 'components'
import { cloneDeep, get, isArray, set } from 'lodash'

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

export default class NormalizeForm extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  updateArrayIndex = (sourceArr, arrayName, index, newValue) => {
    const { analysisOptions } = this.props
    let newArr = cloneDeep(sourceArr)
    newArr[index] = newValue
    sourceArr[index] = parseFloat(newValue)

    const [fieldName, fieldIndex] = arrayName.split('.')
    let nextFieldValue = cloneDeep(get(analysisOptions, [fieldName, 'value']))
    set(nextFieldValue, fieldIndex, newArr)

    this.props.setOption(fieldName, 'value', nextFieldValue)
  }

  arrayForm = (arrayValue, fieldName, min, max, step) => {
    const { readOnly } = this.props

    return arrayValue.map((item, id) => {
      return isArray(item) ? (
        <Row key={id}>{this.arrayForm(item, `${fieldName}.${id}`, min, max, step)}</Row>
      ) : (
        <InputNumber
          disabled={readOnly}
          key={`${fieldName}_${id}`}
          id={`${fieldName}_${id}`}
          value={item}
          min={min}
          max={max}
          step={step}
          onChange={newValue => this.updateArrayIndex(arrayValue, fieldName, id, newValue)}
        />
      )
    })
  }

  render() {
    const { analysisOptions, readOnly } = this.props

    const {
      normalize_affine_regularization_type,
      normalize_write_bounding_box,
      normalize_write_interp,
      normalize_write_voxel_sizes,
      normalize_template,
    } = analysisOptions

    return (
      <Form layout="vertical">
        <FormItem label="Template" {...formItemLayout}>
          <Select
            disabled={readOnly}
            id="normalize_template"
            value={get(normalize_template, 'value')}
            onChange={value => this.props.setOption('normalize_template', 'value', value)}
          >
            <Option value="EPI">EPI</Option>
            <Option value="TPM">TPM</Option>
          </Select>
        </FormItem>
        <FormItem label="Affine Regularization" {...formItemLayout}>
          <Select
            disabled={readOnly}
            id="normalize_affine_regularization_type"
            value={get(normalize_affine_regularization_type, 'value')}
            onChange={value => this.props.setOption('normalize_affine_regularization_type', 'value', value)}
          >
            <Option value="mni">MNI</Option>
            <Option value="eastern">Eastern</Option>
            <Option value="subj">Subject</Option>
            <Option value="none">None</Option>
          </Select>
        </FormItem>
        <FormItem label="Write Bounding Box" {...formItemLayout}>
          {this.arrayForm(normalize_write_bounding_box.value, 'normalize_write_bounding_box', -300, 300, 1)}
        </FormItem>
        <FormItem label="Write Interpolation" {...formItemLayout}>
          <InputNumber
            id="normalize_write_interp"
            value={get(normalize_write_interp, 'value')}
            min={1}
            max={162}
            disabled={readOnly}
            onChange={value => this.props.setOption('normalize_write_interp', 'value', value)}
          />
        </FormItem>
        <FormItem label="Write Voxel Sizes" {...formItemLayout}>
          {this.arrayForm(normalize_write_voxel_sizes.value, 'normalize_write_voxel_sizes', -300, 300, 0.1)}
        </FormItem>
      </Form>
    )
  }
}
