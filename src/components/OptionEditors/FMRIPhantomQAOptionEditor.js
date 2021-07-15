import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Col, Collapse, Form, InputNumber, Row, Typography } from 'antd'
import { getParameterLayouts } from 'utils/common'

const { Item: FormItem } = Form
const { Panel } = Collapse
const { Text } = Typography

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

export default class FMRIPhantomQAOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
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

  renderInputNumber = (fieldName, label, precision = 4) => {
    const { analysisOptions, readOnly } = this.props

    return (
      <FormItem label={label} disabled={readOnly} {...formItemLayout}>
        <InputNumber
          value={get(analysisOptions, [fieldName, 'value'])}
          min={0}
          max={1}
          disabled={readOnly}
          precision={precision}
          onChange={value => this.handleSetOption(fieldName, 'value', value)}
        />
      </FormItem>
    )
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const { formLayout, gridLayout } = getParameterLayouts()

    return (
      <Row>
        <Col {...gridLayout}>
          <FormItem label="Slice of Interest" disabled={readOnly} {...formLayout}>
            <InputNumber
              value={analysisOptions.slice.value}
              min={0}
              disabled={readOnly}
              precision={0}
              onChange={value => this.handleSetOption('slice', 'value', value)}
            />
          </FormItem>
        </Col>
        <Col md={24}>
          <Text>The factors below are relative to total number of columns or rows in image.</Text>
          <Collapse>
            <Panel header="Signal ROI">
              {this.renderInputNumber('si_row_start_factor', 'Row Start Factor')}
              {this.renderInputNumber('si_row_width_factor', 'Row Width Factor')}
              {this.renderInputNumber('si_col_start_factor', 'Column Start Factor')}
              {this.renderInputNumber('si_col_width_factor', 'Column Width Factor')}
            </Panel>
            <Panel header="SNR Image ROI">
              {this.renderInputNumber('snr_im_row_start_factor', 'Row Start Factor')}
              {this.renderInputNumber('snr_im_row_width_factor', 'Row Width Factor')}
              {this.renderInputNumber('snr_im_col_start_factor', 'Column Start Factor')}
              {this.renderInputNumber('snr_im_col_width_factor', 'Column Width Factor')}
            </Panel>
            <Panel header="SNR Background ROI">
              {this.renderInputNumber('snr_bg_row_start_factor', 'Row Start Factor')}
              {this.renderInputNumber('snr_bg_row_width_factor', 'Row Width Factor')}
              {this.renderInputNumber('snr_bg_col_start_factor', 'Column Start Factor')}
              {this.renderInputNumber('snr_bg_col_width_factor', 'Column Width Factor')}
            </Panel>
            <Panel header="Ghost Image ROI">
              {this.renderInputNumber('ghost_im_row_start_factor', 'Row Start Factor')}
              {this.renderInputNumber('ghost_im_row_width_factor', 'Row Width Factor')}
              {this.renderInputNumber('ghost_im_col_start_factor', 'Column Start Factor')}
              {this.renderInputNumber('ghost_im_col_width_factor', 'Column Width Factor')}
            </Panel>
            <Panel header="Ghost Background ROI">
              {this.renderInputNumber('ghost_bg_row_start_factor', 'Row Start Factor')}
              {this.renderInputNumber('ghost_bg_row_width_factor', 'Row Width Factor')}
              {this.renderInputNumber('ghost_bg_col_start_factor', 'Column Start Factor')}
              {this.renderInputNumber('ghost_bg_col_width_factor', 'Column Width Factor')}
            </Panel>
          </Collapse>
        </Col>
      </Row>
    )
  }
}
