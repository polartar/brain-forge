import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button, Card, Col, Row, Tabs, Divider } from 'antd'
import cx from 'classnames'
import { find, get, isEqual, kebabCase, map } from 'lodash'
import { PROBLEM_ORDER } from 'config/base'
import { listProblemSet, selectProblems, selectAnalysesStatus, LIST_PROBLEM_SET } from 'store/modules/analyses'
import { PageLayout } from 'containers/Layouts'
import { Loader } from 'components'

const { TabPane } = Tabs

export class AnalysisRunPage extends Component {
  static propTypes = {
    problems: PropTypes.array,
    status: PropTypes.string,
    listProblemSet: PropTypes.func,
  }

  state = {
    sortedProblems: [],
    activeTab: null,
    activeSolution: null,
  }

  componentWillMount() {
    this.props.listProblemSet()
    this.initializeState(this.props.problems)
  }

  componentWillReceiveProps(nextProps) {
    const { problems } = this.props

    if (!isEqual(problems, nextProps.problems)) {
      this.initializeState(nextProps.problems)
    }
  }

  initializeState = problems => {
    if (!problems || problems.length === 0) {
      this.setState({ sortedProblems: [], activeTab: null, activeSolution: null })
      return
    }

    const sortedProblems = PROBLEM_ORDER.reduce((acc, name) => {
      acc.push(find(problems, { name }))
      return acc
    }, [])

    this.setState({
      sortedProblems,
      activeTab: sortedProblems[0].name,
      activeSolution: sortedProblems[0].solution_sets[0].name,
    })
  }

  handleTabsChange = activeTab => {
    const { sortedProblems } = this.state
    const problem = find(sortedProblems, { name: activeTab })

    this.setState({ activeTab, activeSolution: problem.solution_sets[0].name })
  }

  handleActiveSolution = activeSolution => {
    this.setState({ activeSolution })
  }

  getActiveSolution = () => {
    const { sortedProblems, activeTab, activeSolution } = this.state

    const problem = find(sortedProblems, { name: activeTab })
    const solution = find(problem.solution_sets, { name: activeSolution })

    return get(solution, 'analysis_types')
  }

  renderContent = () => {
    const { status } = this.props
    const { sortedProblems, activeTab, activeSolution } = this.state

    const loading = status === LIST_PROBLEM_SET

    if (loading) {
      return <Loader />
    }

    if (!sortedProblems || sortedProblems.length === 0) {
      return <div className="app-page__subheading">No Data</div>
    }

    const analysisTypes = this.getActiveSolution()

    return (
      <Row gutter={20}>
        <Col>
          <div className="analysis-run">
            <Tabs
              animated={{ inkBar: false, tabPane: false }}
              type="card"
              activeKey={activeTab}
              onChange={this.handleTabsChange}
            >
              {map(sortedProblems, ({ name, description, solution_sets }) => (
                <TabPane key={name} tab={`${name} (${solution_sets.length})`}>
                  <div className="analysis-run__content">
                    <Row>
                      <Col lg={6}>
                        <div className="analysis-computation">
                          <div className="analysis-computation__title">Computations</div>
                          <div className="analysis-computation__subtitle">Select Method from Options Below</div>

                          <div className="analysis-solution-links">
                            {solution_sets.map(solution_set => (
                              <div
                                key={solution_set.id}
                                className={cx('analysis-solution-link', {
                                  'analysis-solution-link--active': solution_set.name === activeSolution,
                                })}
                                onClick={() => this.handleActiveSolution(solution_set.name)}
                              >
                                {solution_set.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </Col>
                      <Col lg={18}>
                        <div className="analysis-detail">
                          <Row gutter={22}>
                            <Col md={12}>
                              <div className="analysis-detail__name">{name}</div>
                              <div className="analysis-detail__description">{description}</div>
                            </Col>
                            <Col md={12}>
                              <div className="analysis-detail__image">
                                <img src={`/analysis-images/${kebabCase(name)}.png`} alt={name} />
                              </div>
                            </Col>
                          </Row>

                          <Divider style={{ backgroundColor: '#ccc', margin: '32px 0' }} />

                          <div className="analysis-solution">
                            <div className="analysis-solution__title">{activeSolution}</div>

                            <Row gutter={12}>
                              {analysisTypes.map(analysisType => (
                                <Col md={8} key={analysisType.id}>
                                  <Card title={analysisType.name}>
                                    {analysisType.description}
                                    <Link to={`/analysis-start/${analysisType.id}`}>
                                      <Button type="primary" className="analysis-solution__button">
                                        Create Analysis
                                      </Button>
                                    </Link>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </div>
        </Col>
      </Row>
    )
  }

  render() {
    return <PageLayout heading="Run an Analysis">{this.renderContent()}</PageLayout>
  }
}

const selectors = createStructuredSelector({
  problems: selectProblems,
  status: selectAnalysesStatus,
})

const actions = {
  listProblemSet,
}

export default connect(
  selectors,
  actions,
)(AnalysisRunPage)
