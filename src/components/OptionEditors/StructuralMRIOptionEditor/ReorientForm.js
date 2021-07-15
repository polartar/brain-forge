import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber } from 'antd'

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

const ReorientForm = ({ analysisOptions, readOnly, setOption }) => {
  const {
    reorient_params_x_mm,
    reorient_params_y_mm,
    reorient_params_z_mm,
    reorient_params_pitch,
    reorient_params_roll,
    reorient_params_yaw,
  } = analysisOptions

  return (
    <Form layout="vertical">
      <FormItem label="x translation in mm" {...formItemLayout}>
        <InputNumber
          id="reorient_params_x_mm"
          value={reorient_params_x_mm.value}
          min={-50}
          max={50}
          disabled={readOnly}
          onChange={value => setOption('reorient_params_x_mm', 'value', value)}
        />
      </FormItem>
      <FormItem label="y translation in mm" {...formItemLayout}>
        <InputNumber
          id="reorient_params_y_mm"
          value={reorient_params_y_mm.value}
          min={-50}
          max={50}
          disabled={readOnly}
          onChange={value => setOption('reorient_params_y_mm', 'value', value)}
        />
      </FormItem>
      <FormItem label="z translation in mm" {...formItemLayout}>
        <InputNumber
          id="reorient_params_z_mm"
          value={reorient_params_z_mm.value}
          min={-50}
          max={50}
          disabled={readOnly}
          onChange={value => setOption('reorient_params_z_mm', 'value', value)}
        />
      </FormItem>
      <FormItem label="x rotation about pitch in degrees[-360,360]" {...formItemLayout}>
        <InputNumber
          id="reorient_params_pitch"
          value={reorient_params_pitch.value}
          min={-360}
          max={360}
          disabled={readOnly}
          onChange={value => setOption('reorient_params_pitch', 'value', value)}
        />
      </FormItem>
      <FormItem label="x rotation about roll in degrees[-360,360]" {...formItemLayout}>
        <InputNumber
          id="reorient_params_roll"
          value={reorient_params_roll.value}
          min={-360}
          max={360}
          disabled={readOnly}
          onChange={value => setOption('reorient_params_roll', 'value', value)}
        />
      </FormItem>
      <FormItem label="x rotation about yaw in degrees[-360,360]" {...formItemLayout}>
        <InputNumber
          id="reorient_params_yaw"
          value={reorient_params_yaw.value}
          min={-360}
          max={360}
          disabled={readOnly}
          onChange={value => setOption('reorient_params_yaw', 'value', value)}
        />
      </FormItem>
    </Form>
  )
}

ReorientForm.propTypes = {
  analysisOptions: PropTypes.object,
  readOnly: PropTypes.bool,
  setOption: PropTypes.func,
}

ReorientForm.defaultProps = {
  readOnly: false,
}

export default ReorientForm
