import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Input, InputNumber, Row } from 'antd'
import { connect } from 'react-redux'
import { fromPairs, get, keys, map } from 'lodash'
import { listDataFile } from 'store/modules/datafiles'
import { SPM_GLM_TIMING_UNITS, SPM_GLM_BASES } from 'config/base'
import { Select, Option } from 'components'
import validators from './validators'

const { Item: FormItem } = Form

export class SPMGLMOptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    listDataFile: PropTypes.func,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
    form: PropTypes.object,
  }

  static defaultProps = {
    readOnly: false,
  }

  componentWillMount() {
    this.props.listDataFile()
  }

  componentDidMount() {
    const { analysisOptions, form } = this.props
    const formValues = fromPairs(map(keys(validators), key => [key, get(analysisOptions, `${key}.value`)]))
    form.setFieldsValue(formValues)
  }

  handleSetOption = (optionName, parameterName, value) => {
    const { setAnalysisOption } = this.props

    this.props.form.setFieldsValue({ [optionName]: value })
    setAnalysisOption &&
      setAnalysisOption({
        name: optionName,
        option: { [parameterName]: value },
      })
  }

  renderBasesGroup = () => {
    const { analysisOptions, readOnly } = this.props
    const bases = analysisOptions.Bases

    return (
      <Row>
        <Col md={10}>
          <FormItem label="Bases:">
            {readOnly ? (
              <Input value={analysisOptions.Bases.value} disabled />
            ) : (
              <Select
                style={{ minWidth: 300 }}
                defaultValue={['hrf']}
                value={bases.value || 'hrf'}
                onChange={value => this.handleSetOption('Bases', 'value', value)}
              >
                {map(SPM_GLM_BASES, unit => (
                  <Option key={unit} value={unit}>
                    {unit}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={10} offset={2}>
          {bases.value === 'hrf' ? (
            <FormItem label="Bases Derivatives">
              <Select
                id="Base_Derivatives"
                style={{ minWidth: 300 }}
                defaultValue="time_derivative"
                value={bases.params.derivs ? JSON.stringify(bases.params.derivs) : '[1,0]'}
                disabled={readOnly}
                onChange={value => this.handleSetOption('Bases', 'params', { derivs: JSON.parse(value) })}
              >
                <Option key="no_derivative" value="[0,0]">
                  No Derivatives [0, 0]
                </Option>
                <Option key="time_derivative" value="[1,0]">
                  Time Derivatives [1, 0]
                </Option>
                <Option key="dispersion_derivative" value="[1,1]">
                  Time and Dispersion Derivatives [1, 1]
                </Option>
              </Select>
            </FormItem>
          ) : (
            <Row>
              <Col md={10}>
                <FormItem label="Bases Length">
                  <InputNumber
                    id="length"
                    value={bases.params.length || 0}
                    min={0}
                    max={1024}
                    precision={0}
                    disabled={readOnly}
                    onChange={value =>
                      this.handleSetOption('Bases', 'params', { length: value, order: bases.params.order })
                    }
                  />
                </FormItem>
              </Col>
              <Col md={2} />
              <Col md={10}>
                <FormItem label="Bases Order">
                  <InputNumber
                    id="order"
                    value={bases.params.order || 0}
                    min={0}
                    max={1024}
                    precision={0}
                    disabled={readOnly}
                    onChange={value =>
                      this.handleSetOption('Bases', 'params', { order: value, length: bases.params.length })
                    }
                  />
                </FormItem>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    )
  }

  render() {
    const { analysisOptions, form, readOnly } = this.props
    const { getFieldDecorator } = form

    return (
      <Row>
        <Col md={24}>
          <Row>
            <Col md={12}>
              <FormItem label={`Interscan interval (${analysisOptions.Timing_Units.value})`}>
                {getFieldDecorator('TR', validators.TR)(
                  <InputNumber
                    id="TR"
                    min={0}
                    max={1024}
                    precision={2}
                    disabled={readOnly}
                    onChange={value => this.handleSetOption('TR', 'value', value)}
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={12}>
              <FormItem label="Timing Units:">
                <Select
                  style={{ minWidth: 300 }}
                  defaultValue={['secs']}
                  value={get(analysisOptions, 'Timing_Units.value', 'secs')}
                  disabled={readOnly}
                  onChange={value => this.handleSetOption('Timing_Units', 'value', value)}
                >
                  {map(SPM_GLM_TIMING_UNITS, unit => (
                    <Option key={unit} value={unit}>
                      {unit}
                    </Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          {this.renderBasesGroup()}
          <FormItem label="High-pass filter cutoff in secs">
            {getFieldDecorator('HPF_Cutoff', validators.HPF_Cutoff)(
              <InputNumber
                id="HPF_Cutoff"
                min={0}
                max={1024}
                precision={2}
                disabled={readOnly}
                onChange={value => this.handleSetOption('HPF_Cutoff', 'value', value)}
              />,
            )}
          </FormItem>
          <FormItem label="Estimation Method">
            <Select
              style={{ minWidth: 300 }}
              defaultValue={'Classical'}
              value={get(analysisOptions, 'Estimation_Method.value', 'Classical')}
              disabled={readOnly}
              onChange={value => this.handleSetOption('Estimation_Method', 'value', value)}
            >
              <Option key="Classical" value="Classical">
                Classical
              </Option>
              <Option key="Bayesian" value="Bayesian">
                Bayesian
              </Option>
              <Option key="Bayesian2" value="Bayesian2">
                2nd Bayesian
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Use FWE Correction">
            <Select
              style={{ minWidth: 300 }}
              defaultValue={true}
              value={get(analysisOptions, 'Use_FWE_Correction.value', true).toString()}
              disabled={readOnly}
              onChange={value => this.handleSetOption('Use_FWE_Correction', 'value', value)}
            >
              <Option key="true" value="true">
                True
              </Option>
              <Option key="false" value="false">
                False
              </Option>
            </Select>
          </FormItem>
          <FormItem label="Height Threshold">
            {getFieldDecorator('Height_Threshold', validators.Height_Threshold)(
              <InputNumber
                id="Height_Threshold"
                min={0}
                max={1}
                placeholder={0.001}
                precision={3}
                disabled={readOnly}
                onChange={value => this.handleSetOption('Height_Threshold', 'value', value)}
              />,
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}

const actions = {
  listDataFile,
}

export const SPMGLMOptionEditorWrappedForm = Form.create()(SPMGLMOptionEditor)

export default connect(
  null,
  actions,
)(SPMGLMOptionEditorWrappedForm)
