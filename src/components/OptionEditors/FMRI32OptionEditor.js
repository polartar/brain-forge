import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { isArray, get } from 'lodash'
import { Col, Divider, Form, Input, InputNumber, Radio, Row } from 'antd'

const { Item: FormItem } = Form

export default class FMRI32OptionEditor extends Component {
  static propTypes = {
    analysisOptions: PropTypes.object,
    readOnly: PropTypes.bool,
    setAnalysisOption: PropTypes.func,
  }

  state = {
    FWHM_fmri: {
      status: 'success',
      error: null,
    },
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

  handleFWHM = value => {
    try {
      // Convert value to an array to validate.
      const fwhmValue = JSON.parse(value)

      if (!isArray(fwhmValue)) {
        throw new Error('FWHM must be an array')
      }

      this.handleSetOption('FWHM_fmri', 'value', fwhmValue)

      // Inform user that the field value is validated succesfully.
      this.setState({
        FWHM_fmri: {
          status: 'success',
          error: null,
        },
      })
    } catch (err) {
      // Set field value to user typed value and insert error msg.
      this.handleSetOption('FWHM_fmri', 'value', value)

      this.setState({
        FWHM_fmri: {
          status: 'error',
          error: 'Please enter a comma-separated array of numbers. For example: [6, 6, 6]',
        },
      })
    }
  }

  render() {
    const { analysisOptions, readOnly } = this.props
    const { FWHM_fmri } = this.state

    return (
      <Fragment>
        <Row gutter={24}>
          <Col md={8}>
            <FormItem label="Epi Base">
              <InputNumber
                value={analysisOptions.Epi_Base.value}
                disabled={readOnly}
                min={0}
                max={1024}
                precision={0}
                onChange={value => this.handleSetOption('Epi_Base', 'value', value)}
              />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="Tshift">
              <Radio.Group
                disabled={readOnly}
                value={analysisOptions.Tshift.value}
                onChange={evt => this.handleSetOption('Tshift', 'value', evt.target.value)}
              >
                <Radio value={'on'}>on</Radio>
                <Radio value={'off'}>off</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="Epi2Anat">
              <Radio.Group
                disabled={readOnly}
                value={analysisOptions.Epi2Anat.value}
                onChange={evt => this.handleSetOption('Epi2Anat', 'value', evt.target.value)}
              >
                <Radio value={true}>true</Radio>
                <Radio value={false}>false</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={8}>
            <FormItem
              label="FWHM_fmri"
              validateStatus={FWHM_fmri.status}
              disabled={readOnly}
              help={FWHM_fmri.error || 'Please enter a separated by comma array of numbers'}
            >
              <Input
                placeholder="[6, 6, 6]"
                disabled={readOnly}
                value={
                  FWHM_fmri.status === 'success'
                    ? JSON.stringify(analysisOptions.FWHM_fmri.value)
                    : analysisOptions.FWHM_fmri.value
                }
                onChange={evt => this.handleFWHM(evt.target.value)}
              />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="Args_alEpiAnat" disabled={readOnly}>
              <Input
                placeholder="Args_alEpiAnat"
                disabled={readOnly}
                value={analysisOptions.Args_alEpiAnat.value}
                onChange={evt => this.handleSetOption('Args_alEpiAnat', 'value', evt.target.value)}
              />
            </FormItem>
          </Col>
          <Col md={8}>
            <FormItem label="Args_Nwarp" disabled={readOnly}>
              <Input
                placeholder="Args_Nwarp"
                disabled={readOnly}
                value={analysisOptions.Args_Nwarp.value}
                onChange={evt => this.handleSetOption('Args_Nwarp', 'value', evt.target.value)}
              />
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <Row gutter={24}>
          <Col md={8}>
            <FormItem
              label="Pass all series under session as inputs?"
              disabled={readOnly}
              help="Select to include all series under the session of Anat series"
            >
              <Radio.Group
                disabled={readOnly}
                onChange={evt => this.handleSetOption('Session_Series', 'value', evt.target.value)}
                value={get(analysisOptions, 'Session_Series.value')}
              >
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={8}>
            <FormItem
              label="Anat"
              disabled={readOnly}
              help="Please make sure this is the series of Analysis selected input, or leave blank for auto-assignment"
            >
              <Input
                placeholder="Anat"
                disabled={readOnly}
                value={get(analysisOptions, 'Anat.value')}
                onChange={evt => this.handleSetOption('Anat', 'value', evt.target.value)}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={8}>
            <FormItem
              label="Funct"
              disabled={readOnly}
              help="Please make sure this series is in the same session with Anat"
            >
              <Input
                placeholder="Funct"
                disabled={readOnly}
                value={get(analysisOptions, 'Funct.value')}
                onChange={evt => this.handleSetOption('Funct', 'value', evt.target.value)}
              />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col md={8}>
            <FormItem
              label="SBRef"
              disabled={readOnly}
              help="Please make sure this series is in the same session with Anat"
            >
              <Input
                placeholder="SBRef"
                disabled={readOnly}
                value={get(analysisOptions, 'SBRef.value')}
                onChange={evt => this.handleSetOption('SBRef', 'value', evt.target.value)}
              />
            </FormItem>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
