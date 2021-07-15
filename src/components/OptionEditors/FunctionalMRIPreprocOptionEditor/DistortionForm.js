import React from 'react'
import PropTypes from 'prop-types'
import { get, isEmpty } from 'lodash'
import { Form, Switch, Input } from 'antd'

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

const DistortionForm = ({ analysisOptions, readOnly, setOption }) => {
  const { dist_path } = analysisOptions
  const [enableDistortion, setEnableDistortion] = React.useState(!isEmpty(get(dist_path, 'value')))

  return (
    <Form layout="vertical">
      <FormItem label="Enable Distortion" {...formItemLayout}>
        <Switch
          checkedChildren="On"
          unCheckedChildren="0ff"
          disabled={readOnly}
          checked={enableDistortion}
          onChange={value => {
            setEnableDistortion(value)
            !value && setOption('dist_path', 'value', null)
          }}
        />
      </FormItem>
      {enableDistortion && (
        <FormItem label="Dist path" {...formItemLayout}>
          <Input
            id="dist_path"
            disabled={readOnly}
            value={get(dist_path, 'value')}
            onChange={evt => setOption('dist_path', 'value', evt.target.value)}
          />
        </FormItem>
      )}
    </Form>
  )
}

DistortionForm.propTypes = {
  analysisOptions: PropTypes.object,
  readOnly: PropTypes.bool,
  setOption: PropTypes.func,
}

DistortionForm.defaultProps = {
  readOnly: false,
}

export default DistortionForm
