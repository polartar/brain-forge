import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get, isArray } from 'lodash'
import { Form, Input, InputNumber, Switch } from 'antd'

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

export default class SliceTimingCorrectionForm extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  state = {
    slicetime_acq_order: {
      status: 'success',
      error: null,
    },
  }

  handleArrayField = (fieldName, fieldValue) => {
    try {
      // Convert value to an array to validate.
      const parsedValue = JSON.parse(fieldValue)

      if (!isArray(parsedValue)) {
        throw new Error('TIs must be an array')
      }

      this.props.setOption(fieldName, 'value', parsedValue)

      // Inform user that the field value is validated succesfully.
      this.setState({
        [fieldName]: {
          status: 'success',
          error: null,
        },
      })
    } catch (err) {
      // Set field value to user typed value and insert error msg.
      this.props.setOption(fieldName, 'value', fieldValue)

      this.setState({
        [fieldName]: {
          status: 'error',
          error: 'Please enter a comma-separated array of numbers. For example: [1, 2, 3]',
        },
      })
    }
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const { slicetime_acq_order: slicetimeState } = this.state
    const slicetimeValue = get(analysisOptions, 'slicetime_acq_order.value')
    const { slicetime_ref_slice } = analysisOptions

    return (
      <Form layout="vertical">
        <FormItem label="Slice Timing Correction" {...formItemLayout}>
          <Switch
            checkedChildren="On"
            unCheckedChildren="0ff"
            disabled={readOnly}
            checked={get(analysisOptions, 'stc_flag.value') === 'On'}
            onChange={value => {
              this.props.setOption('stc_flag', 'value', value ? 'On' : 'Off')
            }}
          />
        </FormItem>
        <FormItem
          label="Slice Acquisition Order"
          validateStatus={slicetimeState.status}
          help={slicetimeState.error || 'Please enter a separated by comma array of numbers'}
          {...formItemLayout}
        >
          <Input
            id="slicetime_acq_order"
            placeholder="[2, 4, 6, ...]"
            disabled={readOnly}
            value={slicetimeState.status === 'success' ? JSON.stringify(slicetimeValue) : slicetimeValue}
            onChange={evt => this.handleArrayField('slicetime_acq_order', evt.target.value)}
          />
        </FormItem>
        <FormItem label="Reference Slice for Reslicing" {...formItemLayout}>
          <InputNumber
            id="slicetime_ref_slice"
            value={get(slicetime_ref_slice, 'value')}
            step={0.1}
            disabled={readOnly}
            onChange={value => this.props.setOption('slicetime_ref_slice', 'value', value)}
          />
        </FormItem>
      </Form>
    )
  }
}
