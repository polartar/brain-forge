import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withSizes } from 'react-sizes'
import { createStructuredSelector } from 'reselect'
import axios from 'axios'
import { Button, Card, Col, Form, Row, Input, Table, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { get, first, pick } from 'lodash'
import qs from 'query-string'
import { TAG_COLORS, BREAKPOINTS } from 'config/base'
import {
  LIST_PROTOCOL_DATA,
  listProtocolData,
  clearProtocolData,
  listParameterSet,
  selectProtocolData,
  selectDataFilesStatus,
} from 'store/modules/datafiles'
import { selectModalities } from 'store/modules/mappings'
import { ProtocolPlanTable, Select, Option } from 'components'
import { getOrderingParam } from 'utils/analyses'
import { PageLayout } from 'containers/Layouts'

const { Item: FormItem } = Form

export class AnalysisPlanPage extends Component {
  static propTypes = {
    protocolData: PropTypes.shape({
      pageSize: PropTypes.number,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number,
      results: PropTypes.array,
    }),
    location: PropTypes.object,
    modalities: PropTypes.array,
    status: PropTypes.string,
    isDesktop: PropTypes.bool,
    listProtocolData: PropTypes.func,
    clearProtocolData: PropTypes.func,
    listParameterSet: PropTypes.func,
  }

  state = {
    sites: [],
    pis: [],
    studies: [],
    site: null,
    pi: null,
    study: null,
    pagination: null,
    sorter: null,
    filters: {},
  }

  componentWillMount() {
    this.props.listParameterSet()
    this.getData('site')

    this.getStudyPlans()
  }

  componentWillUnmount() {
    this.props.clearProtocolData()
  }

  componentWillReceiveProps(nextProps) {
    this.setPagination(nextProps)
  }

  getStudyPlans = () => {
    const { location } = this.props

    const study = get(qs.parse(location.search), 'study')

    if (!study) {
      return
    }

    this.props.listProtocolData({ params: { study, page: 1 } })
    this.getStudyDetail(study)
  }

  getStudyDetail = async study => {
    try {
      const { data } = await axios.get(`/study/${study}/`)
      const { id, full_name, principal_investigator, site } = data

      const pis = site.principal_investigators.map(pi => ({
        id: pi.id,
        name: pi.username,
      }))
      const pi = get(principal_investigator, 'id')

      this.setState({
        site: String(site.id),
        pis,
        pi: String(pi),
        studies: [{ id, name: full_name }],
        study: String(id),
      })
    } catch {}
  }

  getData = async fieldName => {
    const fieldMap = {
      site: 'sites',
      pi: 'pis',
      study: 'studies',
    }

    const params = this.getQueryParams(fieldName)

    if (fieldName === 'site') {
      this.setState({ pis: [], studies: [] })
    } else if (fieldName === 'pi') {
      this.setState({ studies: [] })
    }

    try {
      const { data } = await axios.get(`/protocol-data/search/${fieldName}/`, { params })

      this.setState(
        Object.assign(
          {
            [fieldMap[fieldName]]: data,
          },
          data.length === 1 && { [fieldName]: data[0].id.toString() },
        ),
        () => {
          if (data.length === 1) {
            this.handleSearch(fieldName)
          }
        },
      )
    } catch {}
  }

  getQueryParams = fieldName => {
    const { site, pi } = this.state

    if (fieldName === 'pi') {
      return { site }
    }

    if (fieldName === 'study') {
      return { pi }
    }
  }

  setPagination = props => {
    const { currentPage, pageSize, totalCount } = props.protocolData
    const pagination = {
      current: currentPage,
      total: totalCount,
      pageSize,
    }

    this.setState({ pagination })
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            node && node.focus()
          }}
          className="searchTxt"
          placeholder={`Search ${dataIndex}`}
          value={first(selectedKeys)}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={confirm}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          name="searchBtn"
          className="searchBtn"
          onClick={confirm}
          icon="searchoutlined"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button name="resetBtn" onClick={clearFilters} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  })

  get data() {
    return this.props.protocolData.results
  }

  get columns() {
    const { modalities, isDesktop } = this.props
    const { study } = this.state

    return [
      {
        title: 'Protocol',
        dataIndex: 'full_name',
        key: 'protocol',
        sorter: true,
        ...this.getColumnSearchProps('Protocol'),
      },
      {
        title: 'Modalities',
        dataIndex: 'modalities',
        key: 'modalities',
        sorter: true,
        filters: modalities.map(modality => ({ text: modality.full_name, value: modality.id })),
        render: (_, record) => {
          return (
            <Fragment>
              {record.modalities.map(modality => (
                <Tag
                  key={modality.id}
                  color={TAG_COLORS[modality.id % (TAG_COLORS.length - 1)]}
                  style={{ marginBottom: 5 }}
                >
                  {modality.full_name}
                </Tag>
              ))}
            </Fragment>
          )
        },
      },
      {
        title: 'Plan',
        dataIndex: 'plan',
        key: 'plan',
        render: (_, record) => {
          return <ProtocolPlanTable {...record} study={Number(study)} isEditable hideModality={!isDesktop} />
        },
      },
    ]
  }

  handleChangeField = (fieldName, data) => {
    const newState = Object.assign(
      { [fieldName]: data },
      fieldName === 'site' && { pi: null, study: null },
      fieldName === 'pi' && { study: null },
    )

    this.setState(newState, () => this.handleSearch(fieldName))
  }

  handleSearch = fieldName => {
    if (fieldName === 'site') {
      this.getData('pi')
    }

    if (fieldName === 'pi') {
      this.getData('study')
    }

    if (fieldName === 'study') {
      this.handleFetchData(true)
    }
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.setState(
      {
        pagination,
        sorter: { ...pick(sorter, ['field', 'order']) },
        filters,
      },
      this.handleFetchData,
    )
  }

  handleFetchData = resetPage => {
    const { study, pagination, sorter, filters } = this.state

    if (!study) {
      return
    }

    const { protocol, modalities } = filters

    const params = Object.assign(
      { study, page: resetPage ? 1 : pagination.current },
      protocol && { protocol: protocol[0] },
      modalities && { modalities: modalities.join(',') },
      sorter && { ordering: getOrderingParam(sorter) },
    )

    this.props.listProtocolData({ params })
  }

  render() {
    const { status, isDesktop } = this.props
    const { pis, studies, sites, pi, study, site, pagination } = this.state

    return (
      <PageLayout heading="Analysis Plans">
        <Card>
          <div className="app-page__subheading">Select PI, Study, and Site to see available protocols to link</div>
          <Row gutter={12}>
            <Col md={8}>
              <FormItem label="Site">
                <Select
                  style={{ width: '100%' }}
                  value={site}
                  disabled={sites.length === 0}
                  onChange={data => this.handleChangeField('site', data)}
                >
                  {sites.map(site => (
                    <Option key={site.id}>{site.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col md={8}>
              <FormItem label="Principal Investigator">
                <Select
                  style={{ width: '100%' }}
                  value={pi}
                  disabled={pis.length === 0}
                  onChange={data => this.handleChangeField('pi', data)}
                >
                  {pis.map(pi => (
                    <Option key={pi.id}>{pi.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            <Col md={8}>
              <FormItem label="Study">
                <Select
                  style={{ width: '100%' }}
                  value={study}
                  disabled={studies.length === 0}
                  onChange={data => this.handleChangeField('study', data)}
                >
                  {studies.map(study => (
                    <Option key={study.id}>{study.name}</Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
          </Row>
          <h2 className="text-center mt-3 mb-1">Link Protocol Steps to Analyses</h2>
          <Table
            dataSource={this.data}
            columns={this.columns}
            size="small"
            bordered
            rowKey="id"
            pagination={{ size: 'large', ...pagination }}
            loading={status === LIST_PROTOCOL_DATA}
            scroll={{ x: !isDesktop }}
            onChange={this.handleTableChange}
          />
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  protocolData: selectProtocolData,
  modalities: selectModalities,
  status: selectDataFilesStatus,
})

const actions = {
  listProtocolData,
  clearProtocolData,
  listParameterSet,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isDesktop: width > BREAKPOINTS.LG,
})

export default compose(
  withSizes(sizes),
  withRouter,
  connect(
    selectors,
    actions,
  ),
)(AnalysisPlanPage)
