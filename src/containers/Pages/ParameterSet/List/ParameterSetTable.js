import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withSizes } from 'react-sizes'
import { withRouter, Link } from 'react-router-dom'
import { Button, Card, Empty, Icon, Input, Modal, Table } from 'antd'
import { compact, get, find } from 'lodash'
import { createStructuredSelector } from 'reselect'
import { BREAKPOINTS } from 'config/base'
import { MenuButton } from 'components'
import { ParameterSetForm } from 'components/Forms'
import { selectAnalysisTypes } from 'store/modules/analyses'
import {
  deleteParameterSet,
  setAnalysisLocation,
  selectParameterSets,
  selectAnalysisLocation,
  selectDataFilesStatus,
  CREATE_PARAMETER_SET,
  DELETE_PARAMETER_SET,
} from 'store/modules/datafiles'
import { getAnalysisLabel } from 'utils/analyses'
import { successAction } from 'utils/state-helpers'

export class ParameterSetTable extends Component {
  static propTypes = {
    analysisTypes: PropTypes.array,
    parameterSets: PropTypes.array,
    shared: PropTypes.bool,
    user: PropTypes.object,
    title: PropTypes.string,
    analysisLocation: PropTypes.string,
    history: PropTypes.object,
    status: PropTypes.string,
    isDesktop: PropTypes.bool,
    isMobile: PropTypes.bool,
    deleteParameterSet: PropTypes.func, // eslint-disable-line
    setAnalysisLocation: PropTypes.func,
  }

  state = {
    parameterSet: null,
  }

  componentWillReceiveProps(nextProps) {
    const { status } = this.props

    if (
      status !== nextProps.status &&
      [successAction(CREATE_PARAMETER_SET), successAction(DELETE_PARAMETER_SET)].indexOf(nextProps.status) !== -1
    ) {
      this.setState({ parameterSet: null })

      if (nextProps.status === successAction(CREATE_PARAMETER_SET) && nextProps.analysisLocation) {
        this.props.history.push(nextProps.analysisLocation)
        this.props.setAnalysisLocation()
      }
    }
  }

  getColumnSearchProps = () => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node
          }}
          placeholder="Search name"
          value={selectedKeys[0]}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
        />
        <Button type="primary" icon="search" size="small" style={{ width: 90, marginRight: 8 }} onClick={confirm}>
          Search
        </Button>
        <Button
          onClick={() => {
            clearFilters()
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record.name
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select())
      }
    },
  })

  get columns() {
    const { analysisTypes, shared, isDesktop } = this.props

    let columns = [
      isDesktop && {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ...this.getColumnSearchProps(),
        render: (_, record) => <Link to={`/parameter-set/${record.id}`}>{record.name}</Link>,
      },
      {
        title: 'Analysis type',
        dataIndex: 'analysis_type',
        key: 'analysis_type',
        filters: analysisTypes.map(analysisType => ({ text: analysisType.label, value: analysisType.id })),
        onFilter: (value, record) => record.analysis_type === value,
        render: (_, { analysis_type }) => get(find(analysisTypes, { id: analysis_type }), 'label'),
      },
      {
        title: 'Shared users',
        dataIndex: 'shared_users',
        key: 'shared_users',
        render: (_, record) => record.shared_users.length || 'No shared users',
      },
      {
        title: 'Version',
        dataIndex: 'version',
        key: 'version',
      },
    ]

    if (!shared) {
      columns.push({
        title: 'Action',
        render: (_, record) => (
          <Button
            className="delete-btn"
            shape="circle"
            icon="delete"
            size="small"
            type="danger"
            onClick={() => this.handleDeleteParameterSet(record)}
          />
        ),
      })
    }

    return compact(columns)
  }

  handleDeleteParameterSet = record => {
    const comp = this

    Modal.confirm({
      title: `Are you sure want to delete this parameter set?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.deleteParameterSet(record.id)
      },
    })
  }

  handleAnalysisSelect = ({ key }) => {
    const { analysisTypes } = this.props
    const analysisType = find(analysisTypes, { label: key })
    const { id, options } = analysisType

    this.setState({
      parameterSet: {
        id: null,
        analysis_type: id,
        options,
        is_custom: true,
        version: null,
      },
    })
  }

  handleParameterSetCancel = () => {
    this.setState({ parameterSet: null })
  }

  get filteredParameterSets() {
    const { parameterSets } = this.props
    const { search } = this.state

    if (!search) {
      return parameterSets
    }

    return parameterSets.filter(parameterSet => parameterSet.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
  }

  get loading() {
    const { status } = this.props

    return [CREATE_PARAMETER_SET, DELETE_PARAMETER_SET].indexOf(status) !== -1
  }

  render() {
    const { shared, title, user, analysisTypes, isMobile } = this.props
    const { parameterSet } = this.state

    return (
      <div>
        {title && <h2 className="app-page__subheading">{title}</h2>}

        {!shared && (
          <div className="text-right mb-1">
            <MenuButton items={analysisTypes} buttonName="Add Parameter Set" onClick={this.handleAnalysisSelect} />
          </div>
        )}

        {parameterSet && (
          <Card className="mb-2">
            <h2 className="text-center mb-2">{getAnalysisLabel(analysisTypes, parameterSet)} Parameter Set</h2>
            <ParameterSetForm
              parameterSet={parameterSet}
              analysisTypes={analysisTypes}
              user={user}
              submitting={this.loading}
              onCancel={this.handleParameterSetCancel}
            />
          </Card>
        )}

        {this.filteredParameterSets.length > 0 ? (
          <Table
            dataSource={this.filteredParameterSets}
            columns={this.columns}
            bordered
            size="small"
            pagination={false}
            createStructuredSelector
            rowKey="id"
            loading={this.loading}
            scroll={{ x: isMobile }}
          />
        ) : (
          <Empty description="No Parameter sets" />
        )}
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  analysisTypes: selectAnalysisTypes,
  parameterSets: selectParameterSets,
  analysisLocation: selectAnalysisLocation,
  status: selectDataFilesStatus,
})

const actions = {
  deleteParameterSet,
  setAnalysisLocation,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.MD,
  isMobile: width < BREAKPOINTS.SM,
})

export default compose(
  withSizes(sizes),
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(ParameterSetTable)
