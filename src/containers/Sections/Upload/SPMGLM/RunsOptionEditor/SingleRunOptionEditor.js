import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { concat, first, fromPairs, get, isEmpty, map, keys, zip } from 'lodash'
import { Alert, Card, Col, Form, Input, Icon, Row } from 'antd'
import DataFileSelect from 'containers/Sections/Upload/DataFileSelect'
import { AnalysisOutputTree, Select, Option } from 'components'
import { trimFileExt } from 'utils/analyses'
import validators from './validators'

const { Item: FormItem } = Form

export class RunOptionEditor extends Component {
  static propTypes = {
    analyses: PropTypes.array,
    index: PropTypes.number,
    readOnly: PropTypes.bool,
    runOption: PropTypes.object,
    form: PropTypes.object,
    handleRemoveRun: PropTypes.func,
    setRunOption: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  componentDidMount() {
    const { runOption, form } = this.props
    const formValues = fromPairs(map(keys(validators), key => [key, runOption[key]]))

    form.setFieldsValue(formValues)
  }

  setRunOption(optionName, value) {
    this.props.form.setFieldsValue({ [optionName]: value })
    this.props.setRunOption(optionName, value)
  }

  handleSetValueByIndex(index, field, value) {
    const { runOption } = this.props
    let fieldValues = runOption[field]

    fieldValues[index] = value
    this.props.setRunOption(field, fieldValues)
  }

  handleAddOnsetEvent() {
    const { runOption } = this.props

    this.props.setRunOption('onsets', concat(runOption.onsets, null))
    this.props.setRunOption('Event_name', concat(runOption.Event_name, ''))
  }

  handleSetOnsetValue(index, files) {
    const onset = first(files)

    if (onset && onset.name) {
      const fileName = trimFileExt(onset.name)

      this.handleSetValueByIndex(index, 'onsets', onset)
      this.handleSetValueByIndex(index, 'Event_name', fileName)
    }
  }

  handleRemoveOnsetEvent(index) {
    let { runOption } = this.props

    runOption.onsets.splice(index, 1)
    runOption.Event_name.splice(index, 1)
    this.props.setRunOption('onsets', runOption.onsets)
    this.props.setRunOption('Event_name', runOption.Event_name)
  }

  render() {
    const { analyses, index, readOnly, runOption } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Card
        title={`Run Number ${index}`}
        extra={
          !readOnly && (
            <a href={`#run_${index}`} onClick={this.props.handleRemoveRun}>
              X
            </a>
          )
        }
      >
        <FormItem label="Run Function">
          <Row>
            <Col md={7}>
              <Select
                style={{ width: '100%' }}
                value={runOption.Func_Source || 'datafile'}
                onSelect={value => {
                  this.setRunOption('Func_Source', value)
                  this.setRunOption('Func_Analysis', null)
                  this.setRunOption('Func_Runs', null)
                }}
              >
                <Option value="datafile">File</Option>
                <Option value="fMRI">fMRI Result</Option>
              </Select>
            </Col>
            <Col md={16} offset={1}>
              {getFieldDecorator('Func_Runs', validators.Func_Runs)(
                runOption.Func_Source === 'fMRI' ? (
                  isEmpty(analyses) ? (
                    <Alert
                      message="No fMRI Analysis outputs to select"
                      type="warning"
                      className="mb-2"
                      showIcon
                      banner
                    />
                  ) : (
                    <AnalysisOutputTree
                      initialValue={{ file: get(runOption, 'Func_Runs'), analysis: get(runOption, 'Func_Analysis') }}
                      analyses={analyses}
                      multiple={false}
                      onChange={({ analysis, file }) => {
                        this.setRunOption('Func_Analysis', analysis)
                        this.setRunOption('Func_Runs', file)
                      }}
                    />
                  )
                ) : (
                  <DataFileSelect
                    initialValue={get(runOption, 'Func_Runs')}
                    name={'func-runs'}
                    disabled={readOnly}
                    handleSelectedFiles={value => this.setRunOption('Func_Runs', first(value))}
                  />
                ),
              )}
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col md={11}>
              <label>Onsets:</label>
            </Col>
            <Col md={10} offset={1}>
              <label>Event Names:</label>
            </Col>
            <Col md={1} offset={1}>
              <Icon type="plus-circle" theme="twoTone" onClick={() => this.handleAddOnsetEvent()} />
            </Col>
          </Row>
          {map(zip(runOption.onsets, runOption.Event_name), ([onset, event_name], index) => (
            <Row key={index}>
              <Col md={11}>
                <DataFileSelect
                  initialValue={onset}
                  name={`onset-${index}`}
                  handleSelectedFiles={value => this.handleSetOnsetValue(index, value)}
                />
              </Col>
              <Col md={10} offset={1}>
                <Input
                  value={event_name}
                  placeholder={`onset_event_${index}`}
                  onChange={evt => this.handleSetValueByIndex(index, 'Event_name', evt.target.value)}
                />
              </Col>
              <Col md={1} offset={1}>
                <Icon
                  key={index}
                  type="minus-square"
                  theme="twoTone"
                  onClick={() => this.handleRemoveOnsetEvent(index)}
                />
              </Col>
            </Row>
          ))}
        </FormItem>
        <FormItem label="Durations (separated by comma)">
          {getFieldDecorator('durations', validators.durations)(
            <Input
              onChange={evt => this.setRunOption('durations', evt.target.value)}
              disabled={readOnly}
              placeholder="[0], [0], [0]"
            />,
          )}
        </FormItem>
        <FormItem label="Regressor Names (separated by comma)">
          {getFieldDecorator('regressor_names', validators.regressor_names)(
            <Input
              onChange={evt => this.setRunOption('regressor_names', evt.target.value)}
              disabled={readOnly}
              placeholder="x1, y1, ..."
            />,
          )}
        </FormItem>
        <FormItem label="Regressors">
          {readOnly ? (
            <Input value={runOption.regressors} disabled />
          ) : (
            getFieldDecorator('regressors', validators.regressors)(
              <DataFileSelect
                initialValue={get(runOption, 'regressors')}
                name={'regressors'}
                handleSelectedFiles={value => this.setRunOption('regressors', first(value))}
              />,
            )
          )}
        </FormItem>
      </Card>
    )
  }
}

const RunOptionEditorWrappedForm = Form.create()(RunOptionEditor)
export default RunOptionEditorWrappedForm
