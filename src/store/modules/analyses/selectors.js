import { get } from 'lodash'

export const selectAnalysesState = state => get(state, 'analyses')

export const selectCurrentAnalysis = state => get(state, 'analyses.selected')

export const selectAnalysisTypes = state => get(state, 'analyses.analysisTypes')

export const selectAnalysisType = state => get(state, 'analyses.analysisType')

export const selectAnalysisTypeOptions = state => get(state, 'analyses.analysisType.options')

export const selectAnalysisOptions = state => get(state, 'analyses.options')

export const selectAnalyses = state => get(state, 'analyses.data')

export const selectAnalysis = state => get(state, 'analyses.analysis')

export const selectProblems = state => get(state, 'analyses.problems')

export const selectProblem = state => get(state, 'analyses.problem')

export const selectAnalysisResult = state => get(state, 'analyses.analysisResult')

export const selectSolutions = state => get(state, 'analyses.solutions')

export const selectSolution = state => get(state, 'analyses.solution')

export const selectAnalysisUsers = state => get(state, 'analyses.analysisUsers')

export const selectAnalysesStatus = state => get(state, 'analyses.status')

export const selectAnalysesError = state => get(state, 'analyses.error')
