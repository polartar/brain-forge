import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Pagination } from 'antd'
import { filter, last, some, uniqBy } from 'lodash'
import { LIST_SESSION, listSession, selectSessions, selectSitesStatus } from 'store/modules/sites'
import { Loader, SummaryTag } from 'components'
import SubjectFilter from './SubjectFilter'

export class PreprocessingSummaryTable extends Component {
  static propTypes = {
    study: PropTypes.object,
    sessions: PropTypes.shape({
      pageSize: PropTypes.number,
      currentPage: PropTypes.number,
      totalCount: PropTypes.number,
      results: PropTypes.array,
    }),
    showTitle: PropTypes.bool,
    status: PropTypes.string,
    listSession: PropTypes.func,
  }

  static defaultProps = {
    showTitle: false,
  }

  state = {
    current: 1,
    pageSize: 10,
    subjectFilter: undefined,
  }

  componentWillMount() {
    this.handleFetchData()
  }

  handleTableChange = current => {
    this.setState({ current }, this.handleFetchData)
  }

  handleShowSizeChange = (_, pageSize) => {
    this.setState({ pageSize, current: 1 }, this.handleFetchData)
  }

  handleFetchData = () => {
    const { study } = this.props
    const { current, pageSize, subjectFilter } = this.state

    const params = Object.assign(
      {
        study: study.label,
        page: current,
        pageSize,
      },
      subjectFilter && { subject: subjectFilter },
    )

    this.props.listSession({ params })
  }

  handleSubjectFilter = subjectFilter => {
    this.setState({ subjectFilter }, this.handleFetchData)
  }

  get loading() {
    const { status } = this.props

    return [LIST_SESSION].includes(status)
  }

  getSessionAnalyses = session => {
    const { study } = this.props

    const { analysis_plans: analysisPlans } = study

    return session.analyses.filter(analysis =>
      some(
        analysisPlans,
        plan => plan.parameter_set.id === analysis.parameter_set && plan.protocol.id === analysis.protocol_info.id,
      ),
    )
  }

  getStudyAnalyses = () => {
    const { study } = this.props

    const { analysis_plans: analysisPlans, analyses } = study

    return analyses.filter(analysis =>
      some(
        analysisPlans,
        plan => plan.parameter_set.id === analysis.parameter_set && plan.protocol.id === analysis.protocol_info.id,
      ),
    )
  }

  getSessionSummaryTagProps = (session, plan) => {
    const sessionAnalyses = this.getSessionAnalyses(session)
    const analyses = filter(
      sessionAnalyses,
      analysis => analysis.parameter_set === plan.parameter_set.id && analysis.protocol_info.id === plan.protocol.id,
    )
    const latestAnalysis = last(analyses)

    if (latestAnalysis) {
      if (latestAnalysis.status === 'Pending') {
        return { tag: 'Running' }
      }

      if (latestAnalysis.status === 'Complete') {
        return { tag: 'Complete', id: latestAnalysis.id }
      }

      if (latestAnalysis.status === 'Error') {
        return { tag: 'Error', id: latestAnalysis.id }
      }

      const totalAnalyses = analyses.length
      const failedAnalyses = filter(analyses, analysis => analysis.status === 'Error').length
      const hasCompletedAnalysis = some(analyses, analysis => analysis.status === 'Complete')

      /* istanbul ignore next */
      if (totalAnalyses >= 5 && failedAnalyses >= 5 && !hasCompletedAnalysis) {
        return { tag: 'Data Issue', id: latestAnalysis.id }
      }
    }

    if (!session.has_series) {
      return { tag: 'No Data' }
    }

    if (session.analyses.length === 0) {
      return { tag: 'Set up' }
    }

    if (session.has_missing_files) {
      return { tag: 'No Data' }
    }

    if (
      some(
        session.analysis_plans,
        elem =>
          elem.protocol === plan.protocol.id &&
          elem.modality === plan.modality.id &&
          elem.analysis_type === plan.analysis_type.id,
      )
    ) {
      return { tag: 'Set up' }
    }

    return { tag: 'No Data' }
  }

  render() {
    const { study, sessions, showTitle } = this.props
    const { current, pageSize, subjectFilter } = this.state

    return (
      <div>
        {showTitle && <div className="app-page__subheading">Preprocessing Summary</div>}
        <div className="summary-table">
          <table>
            <thead>
              <tr className="summary-table__analysis">
                <th colSpan={2}>Analyses</th>
                {study.analysis_plans.map(plan => (
                  <th key={plan.id}>{plan.analysis_type.label}</th>
                ))}
              </tr>
              <tr className="summary-table__parameter">
                <th colSpan={2}>Parameters</th>
                {study.analysis_plans.map(plan => (
                  <th key={plan.id}>{plan.parameter_set.name}</th>
                ))}
              </tr>
              <tr className="summary-table__subject-session">
                <th style={{ position: 'relative' }}>
                  Subject ({study.subject_count})
                  <SubjectFilter value={subjectFilter} studyLabel={study.label} onFilter={this.handleSubjectFilter} />
                </th>
                <th>Session ({study.session_count})</th>
                {study.analysis_plans.map(plan => (
                  <th key={plan.id}>{plan.protocol.full_name}</th>
                ))}
              </tr>
              <tr className="summary-table__total">
                <th colSpan={2}>Total Completed</th>
                {study.analysis_plans.map(plan => {
                  let completedAnalyses = uniqBy(
                    filter(
                      this.getStudyAnalyses(),
                      analysis =>
                        analysis.parameter_set === plan.parameter_set.id &&
                        analysis.protocol_info.id === plan.protocol.id &&
                        analysis.status === 'Complete',
                    ),
                    v => [v.parameter_set, v.session_info.id, v.protocol_info.id].join(),
                  )

                  if (subjectFilter) {
                    completedAnalyses = filter(
                      completedAnalyses,
                      analysis => analysis.subject_info.id === subjectFilter,
                    )
                  }

                  return (
                    <th key={plan.id}>
                      {completedAnalyses.length}/{sessions.totalCount}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {sessions.results.map(session => (
                <tr key={session.id}>
                  <td>{session.subject}</td>
                  <td>{session.segment_interval}</td>
                  {study.analysis_plans.map(plan => (
                    <td key={plan.id}>
                      <SummaryTag {...this.getSessionSummaryTagProps(session, plan)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {this.loading && (
            <div className="summary-loader">
              <Loader />
            </div>
          )}
        </div>
        <div className="summary-pagination">
          <Pagination
            current={current}
            total={sessions.totalCount}
            showSizeChanger
            pageSize={pageSize}
            pageSizeOptions={['10', '20', '50', '100']}
            onChange={this.handleTableChange}
            onShowSizeChange={this.handleShowSizeChange}
          />
        </div>
      </div>
    )
  }
}

const selectors = createStructuredSelector({
  sessions: selectSessions,
  status: selectSitesStatus,
})

const actions = {
  listSession,
}

export default connect(
  selectors,
  actions,
)(PreprocessingSummaryTable)
