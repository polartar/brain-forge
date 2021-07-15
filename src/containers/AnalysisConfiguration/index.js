import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import { Button, Card, Checkbox, Form, Input } from 'antd'
import { find, get, last, map, orderBy } from 'lodash'
import { ANALYSIS_VARIABLE_CONFIGURATIONS, ANALYSIS_COVARIATE_CONFIGURATIONS, BREAKPOINTS } from 'config/base'
import {
  initAnalysisOptions,
  setAnalysisOption,
  selectAnalysis,
  selectAnalysisOptions,
  selectAnalysisType,
  selectAnalysesStatus,
  GET_ANALYSIS_TYPE,
} from 'store/modules/analyses'
import {
  toggleAllCurrentFilesField,
  updateCurrentFilesField,
  selectCurrentFiles,
  selectParameterSets,
  setAnalysisLocation,
  selectDataFilesStatus,
  CREATE_PARAMETER_SET,
  UPDATE_PARAMETER_SET,
} from 'store/modules/datafiles'
import { selectLoggedInUser } from 'store/modules/auth'
import {
  CovariateConfigurationTable,
  Loader,
  Option,
  ParameterSetForm,
  Select,
  VariableConfigurationTable,
  UnivariateConfigurationTable,
} from 'components'
import { successAction } from 'utils/state-helpers'
import { SLURM_PARTITIONS } from 'config/base'

const { Item: FormItem } = Form

export class AnalysisConfiguration extends Component {
  static propTypes = {
    analysis: PropTypes.object,
    analysisOptions: PropTypes.object,
    analysisType: PropTypes.object,
    analysesStatus: PropTypes.string,
    currentFiles: PropTypes.array,
    parameterSets: PropTypes.array,
    dataFilesStatus: PropTypes.string,
    user: PropTypes.object,
    isDesktop: PropTypes.bool,
    initAnalysisOptions: PropTypes.func,
    setAnalysisOption: PropTypes.func,
    setAnalysisLocation: PropTypes.func,
    toggleAllCurrentFilesField: PropTypes.func,
    updateCurrentFilesField: PropTypes.func,
  }

  state = {
    parameterSet: null,
  }

  componentWillMount() {
    const { analysis, analysisType } = this.props

    this.props.setAnalysisOption({ name: 'group_analysis', option: { value: analysisType.options.group_analysis } })

    if (analysis) {
      const payload = {
        name: { value: analysis.name },
        description: { value: analysis.description },
        parameter_set: { value: get(analysis, 'parameters.analysis.parameter_set') },
        group_analysis: { value: get(analysis, 'parameters.analysis.group_analysis') },
        slurm_partition: { value: get(analysis, 'parameters.analysis.slurm_partition') },
      }

      this.props.initAnalysisOptions(payload)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dataFilesStatus } = this.props
    if (
      nextProps.dataFilesStatus !== dataFilesStatus &&
      [successAction(CREATE_PARAMETER_SET), successAction(UPDATE_PARAMETER_SET)].includes(nextProps.dataFilesStatus)
    ) {
      this.setState({ parameterSet: null })

      const lastParameterSetId = get(last(orderBy(nextProps.parameterSets, ['id'], ['asc'])), 'id')

      if (nextProps.dataFilesStatus === successAction(CREATE_PARAMETER_SET) && lastParameterSetId) {
        this.handleAnalysisOptionChange('parameter_set', lastParameterSetId)
      }
    }
  }

  get showConfiguration() {
    const { analysisType } = this.props
    const { label } = analysisType
    return ANALYSIS_VARIABLE_CONFIGURATIONS.includes(label)
  }

  get showCovariateConfiguration() {
    const { analysisType } = this.props
    const { label } = analysisType
    return ANALYSIS_COVARIATE_CONFIGURATIONS.includes(label)
  }

  get preparingData() {
    const { analysesStatus } = this.props
    return analysesStatus === GET_ANALYSIS_TYPE
  }

  get isLoading() {
    const { dataFilesStatus } = this.props
    return [CREATE_PARAMETER_SET, UPDATE_PARAMETER_SET].includes(dataFilesStatus)
  }

  handleAnalysisOptionChange = (name, value) => {
    this.props.setAnalysisOption({ name, option: { value } })
  }

  handleAnalysisSelect = parameterSetId => {
    const { analysisType, parameterSets } = this.props
    const { id, options } = analysisType

    if (!parameterSetId) {
      this.setState({
        parameterSet: {
          id: null,
          analysis_type: id,
          options,
          is_custom: true,
          version: null,
        },
      })

      return
    }

    const parameterSet = find(parameterSets, { id: parameterSetId })

    this.setState({ parameterSet })
  }

  handleParameterSetCancel = () => {
    this.setState({ parameterSet: null })
  }

  render() {
    const { analysisType, analysisOptions, currentFiles, parameterSets, user, isDesktop } = this.props
    const { parameterSet } = this.state

    if (this.preparingData) {
      return <Loader />
    }

    if (!analysisType) {
      return null
    }

    const formItemLayout = {
      labelCol: {
        lg: { span: 24 },
        xl: { span: 8 },
        xxl: { span: 4 },
      },
      wrapperCol: {
        lg: { span: 24 },
        xl: { span: 16 },
        xxl: { span: 20 },
      },
    }

    const analysisParameterSets = parameterSets.filter(parameterSet => parameterSet.analysis_type === analysisType.id)

    const selectedParameterSet = get(analysisOptions, 'parameter_set.value')

    const elemWidth = isDesktop ? 300 : '100%'

    return (
      <Fragment>
        {this.showConfiguration && (
          <div>
            {map(currentFiles, (file, ind) => (
              <VariableConfigurationTable
                key={ind}
                file={file}
                toggleAllCurrentFilesField={this.props.toggleAllCurrentFilesField}
                updateCurrentFilesField={this.props.updateCurrentFilesField}
              />
            ))}
          </div>
        )}
        {this.showCovariateConfiguration && (
          <div>
            {map(currentFiles, (file, ind) => (
              <CovariateConfigurationTable
                key={ind}
                file={file}
                toggleAllCurrentFilesField={this.props.toggleAllCurrentFilesField}
                updateCurrentFilesField={this.props.updateCurrentFilesField}
              />
            ))}
          </div>
        )}
        {this.showCovariateConfiguration && (
          <div>
            {map(currentFiles, (file, ind) => (
              <UnivariateConfigurationTable
                key={ind}
                file={file}
                toggleAllCurrentFilesField={this.props.toggleAllCurrentFilesField}
                updateCurrentFilesField={this.props.updateCurrentFilesField}
              />
            ))}
          </div>
        )}
        <FormItem label="Name" {...formItemLayout}>
          <Input
            style={{ width: elemWidth }}
            value={get(analysisOptions, 'name.value')}
            onChange={evt => this.handleAnalysisOptionChange('name', evt.target.value)}
          />
        </FormItem>
        <FormItem label="Description" {...formItemLayout}>
          <Input
            style={{ width: elemWidth }}
            value={get(analysisOptions, 'description.value')}
            onChange={evt => this.handleAnalysisOptionChange('description', evt.target.value)}
          />
        </FormItem>
        <FormItem label="Group Analysis" {...formItemLayout}>
          <Checkbox
            checked={get(analysisOptions, 'group_analysis.value')}
            onChange={evt => this.handleAnalysisOptionChange('group_analysis', evt.target.checked)}
          />
        </FormItem>
        <FormItem className="slurmPartition" label="Slurm Partition:" {...formItemLayout}>
          <Select
            placeholder="Use value in Parameter Set by default"
            style={{ width: elemWidth }}
            value={get(analysisOptions, 'slurm_partition.value')}
            onChange={value => this.handleAnalysisOptionChange('slurm_partition', value)}
          >
            {map(SLURM_PARTITIONS, partition => (
              <Option key={partition} value={partition}>
                {partition}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="Parameter Set" {...formItemLayout}>
          {analysisParameterSets.length > 0 ? (
            <Select
              style={{ width: elemWidth }}
              value={selectedParameterSet}
              className="mr-1"
              onChange={value => {
                parameterSet && this.handleAnalysisSelect(value)
                this.handleAnalysisOptionChange('parameter_set', value)
              }}
            >
              {analysisParameterSets.map(analysisParamSet => (
                <Option key={analysisParamSet.id} value={analysisParamSet.id}>
                  {analysisParamSet.name} - v{analysisParamSet.version}
                </Option>
              ))}
            </Select>
          ) : (
            <span className="mr-1">No Parameter sets</span>
          )}

          {selectedParameterSet && (
            <Button
              className="edit-parameter-set-btn mr-1"
              size="small"
              icon="edit"
              type="primary"
              onClick={() => this.handleAnalysisSelect(selectedParameterSet)}
            >
              Edit Parameter Set
            </Button>
          )}

          <Button
            className="create-parameter-set-btn mr-1"
            size="small"
            icon="plus"
            type="primary"
            onClick={() => this.handleAnalysisSelect()}
          >
            New Parameter Set
          </Button>
        </FormItem>

        {parameterSet && (
          <Card className="mb-2">
            <h2 className="text-center mb-2">{analysisType.label} Parameter Set</h2>
            <ParameterSetForm
              parameterSet={parameterSet}
              analysisTypes={[analysisType]}
              user={user}
              submitting={this.isLoading}
              onCancel={this.handleParameterSetCancel}
            />
          </Card>
        )}
      </Fragment>
    )
  }
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisOptions: selectAnalysisOptions,
  analysisType: selectAnalysisType,
  currentFiles: selectCurrentFiles,
  parameterSets: selectParameterSets,
  user: selectLoggedInUser,
  analysesStatus: selectAnalysesStatus,
  dataFilesStatus: selectDataFilesStatus,
})

const actions = {
  initAnalysisOptions,
  setAnalysisOption,
  toggleAllCurrentFilesField,
  updateCurrentFilesField,
  setAnalysisLocation,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width >= BREAKPOINTS.XXL,
})

export default compose(
  withSizes(sizes),
  connect(
    selectors,
    actions,
  ),
)(AnalysisConfiguration)
