import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Alert, Button, Modal, Switch, Table, Tooltip } from 'antd'
import { compact, find, get } from 'lodash'
import { selectIsSuperUser } from 'store/modules/auth'
import { selectAnalysisTypes } from 'store/modules/analyses'
import {
  selectDataFilesStatus,
  selectParameterSets,
  createAnalysisPlan,
  updateAnalysisPlan,
  deleteAnalysisPlan,
  CREATE_ANALYSIS_PLAN,
  UPDATE_ANALYSIS_PLAN,
} from 'store/modules/datafiles'
import { Drawer } from 'components'
import { successAction } from 'utils/state-helpers'
import AnalsysisPlanForm from './AnalysisPlanForm'

export class ProtocolPlanTable extends Component {
  static propTypes = {
    isSuperUser: PropTypes.bool,
    isEditable: PropTypes.bool,
    id: PropTypes.number,
    study: PropTypes.number,
    plans: PropTypes.array,
    modalities: PropTypes.array,
    analysisTypes: PropTypes.array,
    parameterSets: PropTypes.array,
    status: PropTypes.string,
    hideModality: PropTypes.bool,
    inCompactMode: PropTypes.bool,
    createAnalysisPlan: PropTypes.func,
    updateAnalysisPlan: PropTypes.func,
    deleteAnalysisPlan: PropTypes.func, // eslint-disable-line
    startAnalysis: PropTypes.func,
  }

  static defaultProps = {
    hideModality: false,
  }

  state = {
    editingRecord: null,
    showDrawer: null,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      [successAction(CREATE_ANALYSIS_PLAN), successAction(UPDATE_ANALYSIS_PLAN)].indexOf(nextProps.status) !== -1
    ) {
      this.setState({
        editingRecord: null,
        showDrawer: null,
      })
    }
  }

  renderParameterSetName = parameterSetId => {
    const { parameterSets } = this.props
    const parameterSet = find(parameterSets, { id: parameterSetId })
    if (!parameterSet) {
      return ''
    }

    return `${parameterSet.name} - v${parameterSet.version}`
  }

  renderActions = plan => {
    const { isEditable } = this.props

    if (!isEditable) {
      return (
        <Button size="small" onClick={() => this.props.startAnalysis(plan.id)}>
          Start
        </Button>
      )
    }

    return (
      <div className="d-flex">
        <Tooltip title="Edit">
          <Button
            className="edit-btn mr-05"
            shape="circle"
            icon="edit"
            size="small"
            onClick={() => this.handleEdit(plan)}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            className="delete-btn"
            shape="circle"
            icon="delete"
            type="danger"
            size="small"
            onClick={() => this.handleDelete(plan)}
          />
        </Tooltip>
      </div>
    )
  }

  get submitting() {
    const { status } = this.props
    return [CREATE_ANALYSIS_PLAN, UPDATE_ANALYSIS_PLAN].indexOf(status) !== -1
  }

  get columns() {
    const { analysisTypes, modalities, hideModality } = this.props

    let columns = [
      !hideModality && {
        title: 'Modality',
        dataIndex: 'modality',
        key: 'modality',
        width: '10%',
        render: text => get(find(modalities, { id: text }), 'full_name'),
      },
      {
        title: 'Analysis',
        dataIndex: 'analysis_type',
        key: 'analysis_type',
        width: '20%',
        render: text => get(find(analysisTypes, { id: text }), 'label'),
      },
      {
        title: 'Parameter Set',
        dataIndex: 'parameter_set',
        key: 'parameter_set',
        width: '50%',
        render: text => this.renderParameterSetName(text),
      },
      {
        title: 'Automatic',
        dataIndex: 'automatic',
        key: 'automatic',
        width: '11%',
        render: (checked, record) => (
          <Switch checked={checked} onChange={value => this.handleToggleAutomatic({ ...record, automatic: value })} />
        ),
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        width: '9%',
        render: (_, record) => this.renderActions(record),
      },
    ]

    return compact(columns)
  }

  toggleDrawer = () => {
    const { showDrawer } = this.state
    this.setState(Object.assign({ showDrawer: !showDrawer }, showDrawer && { editingRecord: null }))
  }

  handleEdit = record => {
    this.setState({ editingRecord: record, showDrawer: true })
  }

  handleToggleAutomatic = record => {
    const comp = this

    if (record.automatic) {
      Modal.confirm({
        title: `Are you sure want this analysis plan to run automatically? This may start analyses immediately. `,
        okText: 'Yes',
        cancelText: 'No',
        onOk() {
          /* istanbul ignore next */
          comp.handleSubmit(record)
        },
      })
    } else {
      comp.handleSubmit(record)
    }
  }

  handleSubmit = values => {
    const { id, ...data } = values

    if (id) {
      this.props.updateAnalysisPlan({ id, data })
    } else {
      this.props.createAnalysisPlan(data)
    }
  }

  handleDelete = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure want to delete this plan?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteAnalysisPlan(record)
      },
    })
  }

  renderCompactTable = () => {
    const { plans, study } = this.props

    return (
      <table>
        <tbody>
          {plans
            .filter(plan => plan.study === study)
            .map(plan => (
              <tr key={plan.id}>
                <td className="pr-05">{this.renderParameterSetName(plan.parameter_set)}</td>
                <td>{this.renderActions(plan)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    )
  }

  renderTable = () => {
    const { study, plans, inCompactMode } = this.props

    if (plans.length === 0) {
      return null
    }

    if (inCompactMode) {
      return this.renderCompactTable()
    }

    const filteredPlans = plans.filter(plan => plan.study === study)

    return (
      <Table dataSource={filteredPlans} columns={this.columns} bordered size="small" pagination={false} rowKey="id" />
    )
  }

  render() {
    const { id, isSuperUser, modalities, analysisTypes, parameterSets, study, isEditable } = this.props
    const { editingRecord, showDrawer } = this.state

    const filteredAnalysisTypes = analysisTypes.filter(({ label }) => label !== 'Regression' && label !== 'Polyssifier')

    if (!modalities || modalities.length === 0) {
      return (
        <div className="ant-row-flex ant-row-flex-end">
          {isSuperUser ? (
            <Link to="/protocol-mapping">
              <Button type="primary" size="small">
                Assign Modality
              </Button>
            </Link>
          ) : (
            <Alert type="warning" message="Please ask admin to assign modalities to this protocol" banner showIcon />
          )}
        </div>
      )
    }

    return (
      <div>
        {isEditable && (
          <div className="mb-05 d-flex justify-content-end">
            <Button
              className="add-step-btn"
              icon="plus"
              type="primary"
              disabled={this.submitting}
              onClick={this.toggleDrawer}
            >
              Add Step
            </Button>
          </div>
        )}

        {this.renderTable()}

        <Drawer title="Analysis Plan" visible={showDrawer} onClose={this.toggleDrawer}>
          <AnalsysisPlanForm
            initialValues={editingRecord}
            protocol={id}
            analysisTypes={filteredAnalysisTypes}
            modalities={modalities}
            parameterSets={parameterSets}
            study={study}
            submitting={this.submitting}
            onSubmit={this.handleSubmit}
            onCancel={this.toggleDrawer}
          />
        </Drawer>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  isSuperUser: selectIsSuperUser,
  analysisTypes: selectAnalysisTypes,
  parameterSets: selectParameterSets,
  status: selectDataFilesStatus,
})

const actions = {
  createAnalysisPlan,
  updateAnalysisPlan,
  deleteAnalysisPlan,
}

export default connect(
  selectors,
  actions,
)(ProtocolPlanTable)
