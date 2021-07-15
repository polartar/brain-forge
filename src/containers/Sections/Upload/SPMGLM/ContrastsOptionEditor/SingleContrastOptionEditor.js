import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { flatten, fromPairs, map, keys } from 'lodash'
import { Card, Form, Input } from 'antd'
import { Select, Option } from 'components'
import validators from './validators'

const { Item: FormItem } = Form

export class SingleContrastOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    contrast: PropTypes.object,
    handleRemoveContrast: PropTypes.func,
    index: PropTypes.number,
    readOnly: PropTypes.bool,
    setContrastOption: PropTypes.func,
    form: PropTypes.object,
  }

  static defaultProps = {
    readOnly: false,
  }

  componentDidMount() {
    const { contrast, form } = this.props
    const formValues = fromPairs(map(keys(validators), key => [key, contrast[key]]))
    form.setFieldsValue(formValues)
  }

  setContrastOption(optionName, value) {
    const { setContrastOption } = this.props
    this.props.form.setFieldsValue({ [optionName]: value })

    setContrastOption && setContrastOption(optionName, value)
  }

  get eventNames() {
    const { analysisOptions } = this.props
    return flatten(map(analysisOptions.Runs.value, run => run.Event_name))
  }

  render() {
    const { contrast, index, readOnly } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Card
        key={`card_${index}`}
        title={`Contrast ${index}`}
        extra={
          !readOnly && (
            <a href={`#contrast_${index}`} onClick={this.props.handleRemoveContrast}>
              X
            </a>
          )
        }
      >
        <FormItem label="Contrast Name">
          {getFieldDecorator('Contrast_Name', validators.Contrast_Name)(
            <Input
              style={{ width: '100%' }}
              disabled={readOnly}
              placeholder={`contrast_name_${index}`}
              onChange={evt => this.setContrastOption('Contrast_Name', evt.target.value)}
            />,
          )}
        </FormItem>
        <FormItem label="Contrast Type">
          {readOnly ? (
            <Input value={contrast.Contrast_Type} disabled />
          ) : (
            <Select
              style={{ width: '100%' }}
              value={contrast.Contrast_Type}
              onChange={value => this.props.setContrastOption('Contrast_Type', value)}
            >
              <Option key="T" value="T">
                T
              </Option>
              <Option key="F" value="F">
                F
              </Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Contrast Events">
          {getFieldDecorator('Contrast_Events', validators.Contrast_Events)(
            <Input
              style={{ width: '100%' }}
              disabled={readOnly}
              placeholder={`contrast_events_${index}`}
              onChange={evt => this.setContrastOption('Contrast_Events', evt.target.value)}
            />,
          )}
        </FormItem>
        <FormItem label="Contrast Weights">
          {getFieldDecorator('Contrast_Weights', validators.Contrast_Weights)(
            <Input
              style={{ width: '100%' }}
              placeholder="[1]"
              disabled={readOnly}
              onChange={evt => this.setContrastOption('Contrast_Weights', evt.target.value)}
            />,
          )}
        </FormItem>
      </Card>
    )
  }
}

const ContrastOptionEditorWrappedForm = Form.create()(SingleContrastOptionEditor)

export default ContrastOptionEditorWrappedForm
