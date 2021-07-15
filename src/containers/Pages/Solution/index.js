import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getSolutionSet, selectSolution, selectAnalysesStatus, GET_SOLUTION_SET } from 'store/modules/analyses'
import { initializeCurrentFiles } from 'store/modules/datafiles'
import { AnalysesSection } from 'containers'
import { Loader } from 'components'
import { PageLayout } from 'containers/Layouts'

export class SolutionPage extends Component {
  static propTypes = {
    match: PropTypes.object,
    solution: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      analysis_types: PropTypes.array,
    }),
    status: PropTypes.string,
    getSolutionSet: PropTypes.func,
    initializeCurrentFiles: PropTypes.func,
  }

  componentWillMount() {
    const { solutionId } = this.props.match.params
    this.props.getSolutionSet(solutionId)
    this.props.initializeCurrentFiles()
  }

  render() {
    const { solution, status } = this.props
    const loading = status === GET_SOLUTION_SET

    if (loading) {
      return <Loader />
    }

    if (!solution) {
      return <PageLayout heading="No Data">No Data</PageLayout>
    }

    const title = solution.analysis_types.length > 1 ? `${solution.name} | Analysis Methods` : solution.name

    return (
      <PageLayout heading={title} subheading={solution.description}>
        <AnalysesSection solution={solution} />
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  solution: selectSolution,
  status: selectAnalysesStatus,
})

const actions = {
  getSolutionSet,
  initializeCurrentFiles,
}

export default connect(
  selectors,
  actions,
)(SolutionPage)
