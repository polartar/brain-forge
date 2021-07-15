import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Checkbox } from 'antd'

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

const SmoothingForm = ({ analysisOptions, readOnly, setOption }) => {
  const { smoothing_x_mm, smoothing_y_mm, smoothing_z_mm, smoothing_implicit_masking } = analysisOptions

  return (
    <Form layout="vertical">
      <FormItem label="Smoothing FWHM(mm) along x" {...formItemLayout}>
        <InputNumber
          id="smoothing_x_mm"
          value={smoothing_x_mm.value}
          min={0}
          max={10}
          disabled={readOnly}
          onChange={value => setOption('smoothing_x_mm', 'value', value)}
        />
      </FormItem>
      <FormItem label="Smoothing FWHM(mm) along y" {...formItemLayout}>
        <InputNumber
          id="smoothing_y_mm"
          value={smoothing_y_mm.value}
          min={0}
          max={10}
          disabled={readOnly}
          onChange={value => setOption('smoothing_y_mm', 'value', value)}
        />
      </FormItem>
      <FormItem label="Smoothing FWHM(mm) along z" {...formItemLayout}>
        <InputNumber
          id="smoothing_z_mm"
          value={smoothing_z_mm.value}
          min={0}
          max={10}
          disabled={readOnly}
          onChange={value => setOption('smoothing_z_mm', 'value', value)}
        />
      </FormItem>
      <FormItem label="Implicit Masking" {...formItemLayout}>
        <Checkbox
          id="smoothing_implicit_masking"
          checked={smoothing_implicit_masking.value}
          onChange={value => setOption('smoothing_implicit_masking', 'value', value === 1)}
        />
      </FormItem>
    </Form>
  )
}

SmoothingForm.propTypes = {
  analysisOptions: PropTypes.object,
  readOnly: PropTypes.bool,
  setOption: PropTypes.func,
}

SmoothingForm.defaultProps = {
  readOnly: false,
}

export default SmoothingForm
