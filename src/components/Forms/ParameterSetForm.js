import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { isEqual, get } from 'lodash'
import { Alert, Button, Checkbox, Col, Form, Input, Row } from 'antd'
import {
  ASLOptionEditor,
  DTIOptionEditor,
  DFNCOptionEditor,
  OptionEditor,
  PolyssifierOptionEditor,
  FunctionalMRIPreprocOptionEditor,
  FMRI32OptionEditor,
  FMRIPhantomQAOptionEditor,
  GroupICAOptionEditor,
  GroupSPMGLMOptionEditor,
  RegressionOptionEditor,
  SPMGLMOptionEditor,
  StructuralMRIOptionEditor,
  MancovaOptionEditor,
  WMHOptionEditor,
  Loader,
} from 'components'
import { createParameterSet, updateParameterSet } from 'store/modules/datafiles'
import { getAnalysisLabel } from 'utils/analyses'

const { Item: FormItem } = Form

export class ParameterSetForm extends Component {
  static propTypes = {
    parameterSet: PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      options: PropTypes.object,
      version: PropTypes.any,
      analyses: PropTypes.object,
      is_custom: PropTypes.bool,
    }),
    analyses: PropTypes.array,
    submitting: PropTypes.bool,
    user: PropTypes.object,
    readOnly: PropTypes.bool,
    analysisTypes: PropTypes.array,
    createParameterSet: PropTypes.func,
    updateParameterSet: PropTypes.func,
    onCancel: PropTypes.func,
  }

  static defaultProps = {
    readOnly: false,
  }

  componentWillMount() {
    this.initializeState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { parameterSet } = this.props

    if (!isEqual(parameterSet, nextProps.parameterSet)) {
      this.initializeState(nextProps)
    }
  }

  initializeState = props => {
    this.setState({ parameterSet: props.parameterSet })
  }

  handleVersionChange = evt => {
    const { parameterSet } = this.state

    this.setState({
      parameterSet: {
        ...parameterSet,
        version: evt.target.value,
      },
      error: null,
    })
  }

  handleCustomChange = evt => {
    const { parameterSet } = this.state

    this.setState({
      parameterSet: {
        ...parameterSet,
        is_custom: evt.target.checked,
      },
    })
  }

  handleUpdateParameterSet = payload => {
    const { name, option } = payload
    const { parameterSet } = this.state

    this.setState({
      parameterSet: update(parameterSet, {
        options: {
          [name]: {
            [get(parameterSet, name) === undefined ? '$set' : '$merge']: option,
          },
        },
      }),
    })
  }

  handleParameterSetSubmit = () => {
    const error = this.validateAnalysis()

    this.setState({ error })

    if (error) {
      return
    }

    const { parameterSet } = this.state
    const { id, options, version, is_custom, analysis_type } = parameterSet

    const { name, description } = options

    const data = {
      name: name.value,
      description: description.value,
      options,
      version,
      is_custom,
      analysis_type,
    }

    if (!id) {
      this.props.createParameterSet(data)
      return
    }

    this.props.updateParameterSet({ id, data })
  }

  validateAnalysis = () => {
    const { analysisTypes } = this.props
    const { parameterSet } = this.state
    const { options, version } = parameterSet

    if (!get(options, 'name.value')) {
      return 'Please input parameter name'
    }

    if (!version) {
      return 'Please input parameter version'
    }

    const label = getAnalysisLabel(analysisTypes, parameterSet)

    if (label === 'Polyssifier' && options.include.value.length === 0) {
      return 'Please select at least one classifier to run'
    }

    return
  }

  renderSubEditor = () => {
    const { analysisTypes, readOnly, analyses } = this.props
    const { parameterSet } = this.state
    const { options } = parameterSet
    const props = {
      file: {},
      analysisOptions: options,
      setAnalysisOption: this.handleUpdateParameterSet,
      allFiles: [],
      readOnly,
    }

    const label = getAnalysisLabel(analysisTypes, parameterSet)

    switch (label) {
      case 'ASL':
        return <ASLOptionEditor {...props} />
      case 'DTI':
        return <DTIOptionEditor {...props} />
      case 'Regression':
        return <RegressionOptionEditor {...props} />
      case 'Polyssifier':
        return <PolyssifierOptionEditor {...props} />
      case 'GICA':
        return <GroupICAOptionEditor {...props} />
      case 'dFNC':
        return <DFNCOptionEditor {...props} analyses={analyses} />
      case 'VBM':
        return <StructuralMRIOptionEditor {...props} />
      case 'fMRI':
        return <FunctionalMRIPreprocOptionEditor {...props} />
      case 'fMRI_32ch':
        return <FMRI32OptionEditor {...props} />
      case 'fMRI_PhantomQA':
        return <FMRIPhantomQAOptionEditor {...props} />
      case 'SPMGLM':
        return <SPMGLMOptionEditor {...props} />
      case 'GroupSPMGLM':
        return <GroupSPMGLMOptionEditor {...props} />
      case 'MANCOVA':
      case 'mancova':
        return <MancovaOptionEditor {...props} />
      case 'WMH':
        return <WMHOptionEditor {...props} />
      default:
        return null
    }
  }

  render() {
    const { user, submitting, readOnly } = this.props
    const { parameterSet, error } = this.state
    const { options, version, is_custom } = parameterSet

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <div>
        {submitting && (
          <div className="pos-full transparent-back">
            <Loader />
          </div>
        )}
        <OptionEditor analysisOptions={options} readOnly={readOnly} setAnalysisOption={this.handleUpdateParameterSet} />
        <Row>
          <Col md={24} lg={12}>
            <FormItem label="Version" {...formItemLayout}>
              <Input value={version} disabled={readOnly} onChange={this.handleVersionChange} />
            </FormItem>
            {user.is_superuser && (
              <FormItem label="Custom" {...formItemLayout}>
                <Checkbox checked={is_custom} disabled={readOnly} onChange={this.handleCustomChange} />
              </FormItem>
            )}
          </Col>
        </Row>
        {this.renderSubEditor()}
        {error && <Alert type="warning" message={error} banner />}
        {!readOnly && (
          <div className="mt-1">
            <Button type="primary mr-05" disabled={submitting} onClick={this.handleParameterSetSubmit}>
              Submit
            </Button>
            <Button disabled={submitting} onClick={this.props.onCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    )
  }
}

const actions = {
  createParameterSet,
  updateParameterSet,
}

export default connect(null, actions)(ParameterSetForm)
