import { handleActions, combineActions } from 'redux-actions'
import update from 'immutability-helper'
import { find, get, isObject } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'
import { prepareAnalysis } from 'utils/analyses'

import {
  LIST_PROBLEM_SET,
  GET_PROBLEM_SET,
  LIST_SOLUTION_SET,
  GET_SOLUTION_SET,
  LIST_ANALYSIS_TYPE,
  GET_ANALYSIS_TYPE,
  LIST_ANALYSIS,
  GET_ANALYSIS,
  UPDATE_ANALYSIS,
  DELETE_ANALYSIS,
  LIST_ANALYSIS_USER,
  CLEAR_ANALYSIS,
  SET_ANALYSIS_PARAMETER,
  INIT_ANALYSIS_OPTIONS,
  CLEAR_ANALYSIS_OPTIONS,
  SET_ANALYSIS_OPTION,
  SET_ANALYSIS,
  SET_ANALYSIS_TYPE,
  CLEAR_ANALYSIS_TYPE,
} from './actions'

/* Initial state */

const initialState = {
  problems: [],
  problem: null,
  solutions: [],
  solution: null,
  analysisTypes: [],
  analysisType: null,
  analysis: null,
  analysisUsers: [],
  selected: {},
  options: {},
  data: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: [],
  },
  status: 'INIT',
  error: null,
}

export const reducer = handleActions(
  {
    [combineActions(
      LIST_PROBLEM_SET,
      LIST_SOLUTION_SET,
      LIST_ANALYSIS_TYPE,
      LIST_ANALYSIS,
      LIST_ANALYSIS_USER,
      GET_ANALYSIS,
      UPDATE_ANALYSIS,
      DELETE_ANALYSIS,
    )]: (state, { type }) => ({
      ...state,
      status: type,
      error: null,
    }),

    [GET_PROBLEM_SET]: (state, { type }) => ({ ...state, problem: null, error: null, status: type }),

    [GET_SOLUTION_SET]: (state, { type }) => ({ ...state, solution: null, error: null, status: type }),

    [GET_ANALYSIS_TYPE]: (state, { type }) => ({ ...state, analysisType: null, error: null, status: type }),

    [successAction(LIST_PROBLEM_SET)]: (state, { payload, type }) => ({ ...state, problems: payload, status: type }),

    [successAction(GET_PROBLEM_SET)]: (state, { payload, type }) => ({ ...state, problem: payload, status: type }),

    [successAction(LIST_SOLUTION_SET)]: (state, { payload, type }) => ({ ...state, solutions: payload, status: type }),

    [successAction(GET_SOLUTION_SET)]: (state, { payload, type }) => ({ ...state, solution: payload, status: type }),

    [successAction(LIST_ANALYSIS_TYPE)]: (state, { payload, type }) => ({
      ...state,
      analysisTypes: payload,
      status: type,
    }),

    [successAction(GET_ANALYSIS_TYPE)]: (state, { payload, type }) => ({
      ...state,
      analysisType: payload,
      status: type,
    }),

    [successAction(LIST_ANALYSIS)]: (state, { payload, type }) => ({ ...state, data: payload, status: type }),

    [successAction(GET_ANALYSIS)]: (state, { payload, type }) => ({
      ...state,
      analysis: payload,
      status: type,
    }),

    [successAction(UPDATE_ANALYSIS)]: (state, { payload, type }) => ({
      ...state,
      analysis: payload,
      status: type,
    }),

    [successAction(DELETE_ANALYSIS)]: (state, { payload, type }) => ({
      ...state,
      data: {
        ...state.data,
        results: state.data.results.filter(analysis => analysis.id !== payload),
      },
      status: type,
    }),

    [successAction(LIST_ANALYSIS_USER)]: (state, { payload, type }) => ({
      ...state,
      analysisUsers: payload,
      status: type,
    }),

    [combineActions(
      failAction(LIST_PROBLEM_SET),
      failAction(GET_PROBLEM_SET),
      failAction(LIST_SOLUTION_SET),
      failAction(GET_SOLUTION_SET),
      failAction(LIST_ANALYSIS_TYPE),
      failAction(GET_ANALYSIS_TYPE),
      failAction(LIST_ANALYSIS),
      failAction(LIST_ANALYSIS_USER),
      failAction(GET_ANALYSIS),
      failAction(UPDATE_ANALYSIS),
      failAction(DELETE_ANALYSIS),
    )]: (state, { payload, type }) => ({ ...state, error: payload.message, status: type }),

    [SET_ANALYSIS_PARAMETER]: (state, { payload, type }) => {
      const newState = update(state, {
        selected: { $merge: payload },
        status: { $set: type },
      })

      return newState
    },

    [SET_ANALYSIS_OPTION]: (state, { payload, type }) => {
      // Use $merge if the payload key is a object. Otherwise, use $set.
      /* istanbul ignore next */
      const updateCommand = isObject(get(state.options, payload.name))
        ? { $merge: payload.option }
        : { $set: payload.option }

      const newState = update(state, {
        options: { [payload.name]: updateCommand },
        status: { $set: type },
      })

      return newState
    },

    [SET_ANALYSIS]: (state, { payload, type }) => {
      const newState = update(state, {
        analysis: { $set: payload },
        status: { $set: type },
      })

      return newState
    },

    [INIT_ANALYSIS_OPTIONS]: (state, { payload, type }) => {
      const newState = update(state, {
        options: { $merge: payload },
        status: { $set: type },
      })

      return newState
    },

    [CLEAR_ANALYSIS_OPTIONS]: (state, { type }) => ({
      ...state,
      options: {},
      status: type,
    }),

    [SET_ANALYSIS_TYPE]: (state, { payload, type }) => {
      const newState = update(state, {
        selected: { $set: prepareAnalysis(find(state.analysisTypes, { id: parseInt(payload, 10) })) },
        status: { $set: type },
      })

      return newState
    },

    [CLEAR_ANALYSIS_TYPE]: (state, { type }) => ({
      ...state,
      analysisType: null,
      status: type,
    }),

    [CLEAR_ANALYSIS]: (state, { type }) => ({
      ...state,
      data: initialState.data,
      status: type,
    }),
  },
  initialState,
)
