import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
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

const ScansForm = ({ analysisOptions, readOnly, setOption }) => {
  return (
    <Form layout="vertical">
      <FormItem label="Number of volumes to remove" {...formItemLayout}>
        <InputNumber
          id="num_vols_to_remove"
          value={get(analysisOptions, 'num_vols_to_remove.value')}
          step={1}
          disabled={readOnly}
          onChange={value => setOption('num_vols_to_remove', 'value', value)}
        />
      </FormItem>
    </Form>
  )
}

ScansForm.propTypes = {
  analysisOptions: PropTypes.object,
  readOnly: PropTypes.bool,
  setOption: PropTypes.func,
}

ScansForm.defaultProps = {
  readOnly: false,
}

export default ScansForm
