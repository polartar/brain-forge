import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { some } from 'lodash'
import { REDIRECT_URL } from 'config/base'
import { getVersion, selectLoggedIn } from 'store/modules/auth'
import { listAnalysisType } from 'store/modules/analyses'
import { listModality } from 'store/modules/mappings'
import Routes from 'routes'
import { setItem, removeItem } from 'utils/storage'

const authRoutes = [
  '/parameter-set',
  '/study',
  '/site',
  '/analysis',
  '/',
  '/status',
  '/me',
  '/my-site',
  '/protocol-mapping',
  '/data-directory',
  '/analysis-plans',
  '/analysis-run',
  '/analysis-start',
  '/analysis',
  '/parameter-set',
  '/preprocessing-summary',
  '/solution',
  '/site',
  '/study',
  '/scanner',
  '/about',
  '/data/new',
  '/users'
]

export class MainApp extends Component {
  static propTypes = {
    loggedIn: PropTypes.bool,
    listAnalysisType: PropTypes.func,
    listModality: PropTypes.func,
    getVersion: PropTypes.func,
  }

  componentWillMount() {
    const { loggedIn } = this.props

    this.props.getVersion()

    if (loggedIn) {
      this.fetchRequiredData()
      removeItem(REDIRECT_URL)
      return
    }

    const { pathname, search } = window.location

    if (some(authRoutes, route => pathname.indexOf(route))) {
      setItem(REDIRECT_URL, `${pathname}${search}`)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { loggedIn } = this.props

    if (loggedIn !== nextProps.loggedIn && nextProps.loggedIn) {
      this.fetchRequiredData()
    }
  }

  fetchRequiredData() {
    this.props.listAnalysisType()
    this.props.listModality()
  }

  render() {
    return <Routes />
  }
}

const selectors = createStructuredSelector({
  loggedIn: selectLoggedIn,
})

const actions = {
  listAnalysisType,
  listModality,
  getVersion,
}

export default connect(
  selectors,
  actions,
)(MainApp)
