import {
  selectAnalysesState,
  selectCurrentAnalysis,
  selectAnalysisTypes,
  selectAnalysisType,
  selectAnalysisTypeOptions,
  selectAnalysisOptions,
  selectAnalysisResult,
  selectAnalysisUsers,
  selectAnalyses,
  selectAnalysis,
  selectProblems,
  selectProblem,
  selectSolutions,
  selectSolution,
  selectAnalysesStatus,
  selectAnalysesError,
} from '../selectors'

const state = {
  analyses: {
    problems: [],
    problem: null,
    solutions: [],
    solution: null,
    analysisTypes: [],
    analysisType: {
      options: {},
    },
    analysis: null,
    analysisUsers: [],
    selected: {},
    options: null,
    data: {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      results: [],
    },
    status: 'INIT',
    error: null,
  },
}

describe('Analyses selectors', () => {
  it('tests', () => {
    const { analyses } = state

    expect(selectAnalysesState(state)).toEqual(analyses)
    expect(selectCurrentAnalysis(state)).toEqual(analyses.selected)
    expect(selectAnalysisTypes(state)).toEqual(analyses.analysisTypes)
    expect(selectAnalysisType(state)).toEqual(analyses.analysisType)
    expect(selectAnalysisTypeOptions(state)).toEqual(analyses.analysisType.options)
    expect(selectAnalysisOptions(state)).toEqual(analyses.options)
    expect(selectAnalyses(state)).toEqual(analyses.data)
    expect(selectAnalysis(state)).toEqual(analyses.analysis)
    expect(selectProblems(state)).toEqual(analyses.problems)
    expect(selectProblem(state)).toEqual(analyses.problem)
    expect(selectAnalysisResult(state)).toEqual(analyses.analysisResult)
    expect(selectAnalysisUsers(state)).toEqual(analyses.analysisUsers)
    expect(selectSolutions(state)).toEqual(analyses.solutions)
    expect(selectSolution(state)).toEqual(analyses.solution)
    expect(selectAnalysesStatus(state)).toEqual(analyses.status)
    expect(selectAnalysesError(state)).toEqual(analyses.error)
  })
})
