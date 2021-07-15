import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Col, Row } from 'antd'
import { Loader, Select, Option } from 'components'
import FormItem from 'antd/lib/form/FormItem'
import axios from 'axios'
import { setAnalysisOption } from 'store/modules/analyses'

export class StudySelect extends Component {
  static propTypes = {
    setAnalysisOption: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      sites: [],
      pis: [],
      studies: [],
      site: null,
      pi: null,
      study: null,
    }
  }

  componentDidMount() {
    this.getSites()
  }

  handleChangeField = (fieldName, data) => {
    const newState = Object.assign(
      { [fieldName]: data },
      fieldName === 'site' && { pi: null, study: null },
      fieldName === 'pi' && { study: null },
    )
    if (fieldName === 'site' || fieldName === 'pi') {
      this.setState(newState, () => this.handleSearch(fieldName))
    } else if (fieldName === 'study') {
      this.setState(newState, () => this.handleStudySelect())
    }
  }

  handleStudySelect = () => {
    this.handleSetOption('study', 'value', this.state.study)
  }

  handleSearch = fieldName => {
    if (fieldName === 'site') {
      this.getPIs()
    } else if (fieldName === 'pi') {
      this.getStudies()
    }
  }

  getSites = async fieldName => {
    this.setState({ pis: [], studies: [] })

    try {
      const { data } = await axios.get(`/site/`)
      this.setState(
        Object.assign(
          {
            sites: data,
          },
          data.length === 1 && { site: data[0].id.toString() },
        ),
        () => {
          if (data.length === 1) {
            this.handleSearch('site')
          }
        },
      )
    } catch {}
  }

  getStudies = async () => {
    try {
      const { data } = await axios.get(`/study/`)
      const { pi } = this.state
      const study_array = data.filter(x => x.principal_investigator.id === parseInt(pi))
      this.setState(
        Object.assign(
          {
            studies: study_array,
          },
          study_array.length === 1 && { study: study_array[0].id.toString() },
        ),
        () => {
          if (study_array.length === 1) {
            this.handleSetOption('study', 'value', this.state.study)
          }
        },
      )
    } catch {}
  }

  getPIs = () => {
    this.setState({ studies: [] })
    const { site } = this.state
    try {
      const siteData = this.state.sites.find(x => x.id === parseInt(site))
      const sitePIs = siteData.principal_investigators

      this.setState(
        Object.assign(
          {
            pis: sitePIs,
          },
          sitePIs.length === 1 && { pi: sitePIs[0].id.toString() },
        ),
        () => {
          if (sitePIs.length === 1) {
            this.handleSearch('pi')
          }
        },
      )
    } catch {}
  }

  handleSetOption = (optionName, parameterName, value) => {
    this.props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  render() {
    const { sites, pis, studies, site, pi, study } = this.state

    if (this.loading) {
      return <Loader />
    }

    return (
      <Fragment>
        <Row gutter={24}>
          <Col md={8}>
            <FormItem label="Site">
              <Select
                style={{ width: '100%' }}
                value={site}
                disabled={sites.length === 0}
                onChange={value => this.handleChangeField('site', value)}
              >
                {sites.map(site => (
                  <Option key={site.id}>{site.full_name}</Option>
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
                onChange={value => this.handleChangeField('pi', value)}
              >
                {pis.map(pi => (
                  <Option key={pi.id}>{pi.username}</Option>
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
                onChange={value => this.handleChangeField('study', value)}
              >
                {studies.map(study => (
                  <Option key={study.id}>{study.full_name}</Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

const selectors = createStructuredSelector({})

const actions = {
  setAnalysisOption,
}

export default connect(selectors, actions)(StudySelect)
