import { createAction } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'

/**
 * Constants
 */
export const LIST_PROBLEM_SET = 'LIST_PROBLEM_SET'
export const GET_PROBLEM_SET = 'GET_PROBLEM_SET'

export const LIST_SOLUTION_SET = 'LIST_SOLUTION_SET'
export const GET_SOLUTION_SET = 'GET_SOLUTION_SET'

export const LIST_ANALYSIS_TYPE = 'LIST_ANALYSIS_TYPE'
export const GET_ANALYSIS_TYPE = 'GET_ANALYSIS_TYPE'

export const LIST_ANALYSIS = 'LIST_ANALYSIS'
export const GET_ANALYSIS = 'GET_ANALYSIS'
export const UPDATE_ANALYSIS = 'UPDATE_ANALYSIS'
export const DELETE_ANALYSIS = 'DELETE_ANALYSIS'
export const LIST_ANALYSIS_USER = 'LIST_ANALYSIS_USER'

export const CLEAR_ANALYSIS = 'CLEAR_ANALYSIS'
export const INIT_ANALYSIS = 'INIT_ANALYSIS'
export const INIT_ANALYSIS_OPTIONS = 'INIT_ANALYSIS_OPTIONS'
export const CLEAR_ANALYSIS_OPTIONS = 'CLEAR_ANALYSIS_OPTIONS'

export const SET_ANALYSIS_PARAMETER = 'SET_ANALYSIS_PARAMETER'
export const SET_ANALYSIS_OPTION = 'SET_ANALYSIS_OPTION'
export const SET_ANALYSIS_TYPE = 'SET_ANALYSIS_TYPE'
export const CLEAR_ANALYSIS_TYPE = 'CLEAR_ANALYSIS_TYPE'
export const SET_ANALYSIS = 'SET_ANALYSIS'
export const RESET_ANALYSIS_OPTION = 'RESET_ANALYSIS_OPTION'


/**
 * Action creators
 */
export const listProblemSet = createAction(LIST_PROBLEM_SET)
export const listProblemSetSuccess = createAction(successAction(LIST_PROBLEM_SET))
export const listProblemSetFail = createAction(failAction(LIST_PROBLEM_SET))

export const getProblemSet = createAction(GET_PROBLEM_SET)
export const getProblemSetSuccess = createAction(successAction(GET_PROBLEM_SET))
export const getProblemSetFail = createAction(failAction(GET_PROBLEM_SET))

export const listSolutionSet = createAction(LIST_SOLUTION_SET)
export const listSolutionSetSuccess = createAction(successAction(LIST_SOLUTION_SET))
export const listSolutionSetFail = createAction(failAction(LIST_SOLUTION_SET))

export const getSolutionSet = createAction(GET_SOLUTION_SET)
export const getSolutionSetSuccess = createAction(successAction(GET_SOLUTION_SET))
export const getSolutionSetFail = createAction(failAction(GET_SOLUTION_SET))

export const listAnalysisType = createAction(LIST_ANALYSIS_TYPE)
export const listAnalysisTypeSuccess = createAction(successAction(LIST_ANALYSIS_TYPE))
export const listAnalysisTypeFail = createAction(failAction(LIST_ANALYSIS_TYPE))

export const getAnalysisType = createAction(GET_ANALYSIS_TYPE)
export const getAnalysisTypeSuccess = createAction(successAction(GET_ANALYSIS_TYPE))
export const getAnalysisTypeFail = createAction(failAction(GET_ANALYSIS_TYPE))

export const initAnalysis = createAction(INIT_ANALYSIS)
export const initAnalysisSuccess = createAction(successAction(INIT_ANALYSIS))
export const initAnalysisFail = createAction(failAction(INIT_ANALYSIS))

export const initAnalysisOptions = createAction(INIT_ANALYSIS_OPTIONS)
export const clearAnalysisOptions = createAction(CLEAR_ANALYSIS_OPTIONS)

export const listAnalysis = createAction(LIST_ANALYSIS)
export const listAnalysisSuccess = createAction(successAction(LIST_ANALYSIS))
export const listAnalysisFail = createAction(failAction(LIST_ANALYSIS))

export const getAnalysis = createAction(GET_ANALYSIS)
export const getAnalysisSuccess = createAction(successAction(GET_ANALYSIS))
export const getAnalysisFail = createAction(failAction(GET_ANALYSIS))

export const updateAnalysis = createAction(UPDATE_ANALYSIS)
export const updateAnalysisSuccess = createAction(successAction(UPDATE_ANALYSIS))
export const updateAnalysisFail = createAction(failAction(UPDATE_ANALYSIS))

export const deleteAnalysis = createAction(DELETE_ANALYSIS)
export const deleteAnalysisSuccess = createAction(successAction(DELETE_ANALYSIS))
export const deleteAnalysisFail = createAction(failAction(DELETE_ANALYSIS))

export const setAnalysis = createAction(SET_ANALYSIS)
export const clearAnalysis = createAction(CLEAR_ANALYSIS)

export const setAnalysisOption = createAction(SET_ANALYSIS_OPTION)

export const setAnalysisType = createAction(SET_ANALYSIS_TYPE)
export const clearAnalysisType = createAction(CLEAR_ANALYSIS_TYPE)

export const setAnalysisParameter = createAction(SET_ANALYSIS_PARAMETER)

export const listAnalysisUser = createAction(LIST_ANALYSIS_USER)
export const listAnalysisUserSuccess = createAction(successAction(LIST_ANALYSIS_USER))
export const listAnalysisUserFail = createAction(failAction(LIST_ANALYSIS_USER))
