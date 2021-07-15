import { pick } from 'lodash'
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
  CLEAR_ANALYSIS,
  LIST_ANALYSIS_USER,
  SET_ANALYSIS_PARAMETER,
  INIT_ANALYSIS_OPTIONS,
  CLEAR_ANALYSIS_OPTIONS,
  SET_ANALYSIS_OPTION,
  SET_ANALYSIS,
  SET_ANALYSIS_TYPE,
  CLEAR_ANALYSIS_TYPE,
} from '../actions'
import { reducer } from '../reducer'
import { UserMock } from 'test/mocks'

const initialState = {
  problems: ['problem'],
  problem: 'problem',
  solutions: ['solution'],
  solution: 'solutoin',
  analysisTypes: ['analysisType'],
  analysisType: 'analysisType',
  analysis: null,
  selected: {},
  options: {},
  data: {
    pageSize: 5,
    currentPage: 1,
    totalCount: 2,
    results: [{ id: 1, name: 'analysis1' }, { id: 2, name: 'analysis2' }],
  },
  operationType: 'analysis',
  status: 'INIT',
  error: 'error',
}

describe('AnalysesReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should return fetching state', () => {
    const actionTypes = [
      LIST_PROBLEM_SET,
      LIST_SOLUTION_SET,
      LIST_ANALYSIS_TYPE,
      LIST_ANALYSIS,
      LIST_ANALYSIS_USER,
      GET_ANALYSIS,
      UPDATE_ANALYSIS,
      DELETE_ANALYSIS,
      GET_PROBLEM_SET,
      GET_SOLUTION_SET,
      GET_ANALYSIS_TYPE,
    ]

    actionTypes.forEach(type => {
      const action = { type }
      const nextState = Object.assign(
        {},
        { ...initialState, error: null, status: action.type },
        type === GET_PROBLEM_SET && { problem: null },
        type === GET_SOLUTION_SET && { solution: null },
        type === GET_ANALYSIS_TYPE && { analysisType: null },
      )

      expect(reducer(initialState, action)).toEqual(nextState)
    })
  })

  it('should return success state', () => {
    let action = { type: successAction(LIST_PROBLEM_SET), payload: 'listedProblemSets' }
    let nextState = reducer(initialState, action)
    expect(pick(nextState, ['problems', 'status'])).toEqual({
      problems: action.payload,
      status: action.type,
    })

    action = { type: successAction(GET_PROBLEM_SET), payload: 'fetchedProblem' }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['problem', 'status'])).toEqual({
      problem: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_SOLUTION_SET), payload: 'listedSolutionSets' }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['solutions', 'status'])).toEqual({
      solutions: action.payload,
      status: action.type,
    })

    action = { type: successAction(GET_SOLUTION_SET), payload: 'fetchedSolutionSet' }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['solution', 'status'])).toEqual({
      solution: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_ANALYSIS_TYPE), payload: 'listedAnalysisTypes' }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysisTypes', 'status'])).toEqual({
      analysisTypes: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(GET_ANALYSIS_TYPE),
      payload: 'fetchedAnalysisType',
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysisType', 'status'])).toEqual({
      analysisType: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_ANALYSIS), payload: [] }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['data', 'status'])).toEqual({
      data: action.payload,
      status: action.type,
    })

    action = { type: successAction(GET_ANALYSIS), payload: 'analysis' }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysis', 'status'])).toEqual({
      analysis: action.payload,
      status: action.type,
    })

    action = { type: successAction(UPDATE_ANALYSIS), payload: { id: 1, name: 'analysis3' } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysis', 'status'])).toEqual({
      analysis: action.payload,
      status: action.type,
    })

    action = { type: successAction(DELETE_ANALYSIS), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['data', 'status'])).toEqual({
      data: { ...initialState.data, results: [{ id: 2, name: 'analysis2' }] },
      status: action.type,
    })

    action = { type: successAction(LIST_ANALYSIS_USER), payload: UserMock(3) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysisUsers', 'status'])).toEqual({
      analysisUsers: action.payload,
      status: action.type,
    })
  })

  it('should return failed state', () => {
    const actionTypes = [LIST_PROBLEM_SET, GET_PROBLEM_SET, LIST_SOLUTION_SET, GET_SOLUTION_SET, LIST_ANALYSIS_TYPE]

    actionTypes.forEach(type => {
      const action = { type: failAction(type), payload: { message: type } }
      const nextState = reducer(initialState, action)

      expect(pick(nextState, ['error', 'status'])).toEqual({
        error: action.payload.message,
        status: action.type,
      })
    })
  })

  it('should set analysis paramter', () => {
    const state = { ...initialState, selected: { parameters: ['c1', 'c2'], value: { field: true } } }
    const action = { type: SET_ANALYSIS_PARAMETER, payload: { parameters: ['c3'], value: { field: false } } }
    const nextState = reducer(state, action)

    expect(pick(nextState, ['selected', 'status'])).toEqual({
      selected: { parameters: ['c3'], value: { field: false } },
      status: action.type,
    })
  })

  it('should set analysis option', () => {
    const state = { ...initialState, options: { c1: { value: true }, c2: { value: true } } }
    const action = { type: SET_ANALYSIS_OPTION, payload: { name: 'c1', option: { value: false } } }
    const nextState = reducer(state, action)

    expect(pick(nextState, ['options', 'status'])).toEqual({
      options: { c1: { value: false }, c2: { value: true } },
      status: action.type,
    })
  })

  it('should set analysis', () => {
    const action = { type: SET_ANALYSIS, payload: 1 }
    const nextState = reducer(initialState, action)

    expect(pick(nextState, ['analysis', 'status'])).toEqual({
      analysis: action.payload,
      status: action.type,
    })
  })

  it('should init analysis options', () => {
    const action = { type: INIT_ANALYSIS_OPTIONS, payload: { name: { value: 'analysis 1' } } }
    const nextState = reducer(initialState, action)

    expect(pick(nextState, ['options', 'status'])).toEqual({
      options: action.payload,
      status: action.type,
    })
  })

  it('should clear analysis options', () => {
    const action = { type: CLEAR_ANALYSIS_OPTIONS }
    const nextState = reducer(initialState, action)
    expect(pick(nextState, ['options', 'status'])).toEqual({
      options: {},
      status: action.type,
    })
  })

  it('should set analysis type', () => {
    const state = { ...initialState, analysisTypes: [{ id: 1 }] }
    const action = { type: SET_ANALYSIS_TYPE, payload: 1 }
    const nextState = reducer(state, action)

    expect(pick(nextState, ['selected', 'status'])).toEqual({
      selected: prepareAnalysis({ id: 1 }),
      status: action.type,
    })
  })

  it('should clear analysis type', () => {
    const action = { type: CLEAR_ANALYSIS_TYPE }
    const nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysisType', 'status'])).toEqual({
      analysisType: null,
      status: action.type,
    })
  })

  it('should clear analysis', () => {
    const action = { type: CLEAR_ANALYSIS }
    const nextState = reducer(initialState, action)
    expect(pick(nextState, ['data', 'status'])).toEqual({
      data: {
        pageSize: 10,
        currentPage: 1,
        totalCount: 0,
        results: [],
      },
      status: action.type,
    })
  })
})
