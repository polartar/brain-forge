import { pick } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'
import { ProtocolsMock, ProtocolMappingMock, ProtocolMappingsMock, ModalitiesMock } from 'test/mocks'
import {
  LIST_PROTOCOL,
  LIST_PROTOCOL_MAPPING,
  CREATE_PROTOCOL_MAPPING,
  UPDATE_PROTOCOL_MAPPING,
  DELETE_PROTOCOL_MAPPING,
  LIST_MODALITY,
} from '../actions'
import { reducer } from '../reducer'

const initialState = {
  protocols: [],
  protocolMappings: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: ProtocolMappingsMock(2),
  },
  modalities: [],
  status: 'INIT',
  error: null,
}

describe('MappingsReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should return fetching state', () => {
    const actionTypes = [
      LIST_PROTOCOL,
      LIST_PROTOCOL_MAPPING,
      CREATE_PROTOCOL_MAPPING,
      UPDATE_PROTOCOL_MAPPING,
      DELETE_PROTOCOL_MAPPING,
      LIST_MODALITY,
    ]

    actionTypes.forEach(type => {
      const nextState = reducer(initialState, { type })
      expect(pick(nextState, ['error', 'status'])).toEqual({ error: null, status: type })
    })
  })

  it('should return success state', () => {
    let action = { type: successAction(LIST_PROTOCOL), payload: ProtocolsMock() }
    let nextState = reducer(initialState, action)
    expect(pick(nextState, ['protocols', 'status'])).toEqual({
      protocols: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_PROTOCOL_MAPPING), payload: ProtocolMappingsMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['protocolMappings', 'status'])).toEqual({
      protocolMappings: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_PROTOCOL_MAPPING) }
    nextState = reducer(initialState, action)
    expect(nextState.status).toEqual(action.type)

    action = { type: successAction(UPDATE_PROTOCOL_MAPPING), payload: ProtocolMappingMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['protocolMappings', 'status'])).toEqual({
      protocolMappings: {
        ...initialState.protocolMappings,
        results: initialState.protocolMappings.results.map(mapping =>
          mapping.id === action.payload.id ? action.payload : mapping,
        ),
      },
      status: action.type,
    })

    action = { type: successAction(DELETE_PROTOCOL_MAPPING), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['protocolMappings', 'status'])).toEqual({
      protocolMappings: {
        ...initialState.protocolMappings,
        results: initialState.protocolMappings.results.filter(mapping => mapping.id !== action.payload),
      },
      status: action.type,
    })

    action = { type: successAction(LIST_MODALITY), payload: ModalitiesMock() }
    nextState = reducer(nextState, action)
    expect(pick(nextState, ['modalities', 'status'])).toEqual({
      modalities: action.payload,
      status: action.type,
    })
  })

  it('should return fail state', () => {
    const actionTypes = [
      LIST_PROTOCOL,
      LIST_PROTOCOL_MAPPING,
      CREATE_PROTOCOL_MAPPING,
      UPDATE_PROTOCOL_MAPPING,
      DELETE_PROTOCOL_MAPPING,
      LIST_MODALITY,
    ]

    actionTypes.forEach(type => {
      const action = { type: failAction(type), payload: { message: type } }
      const nextState = reducer(initialState, action)

      expect(pick(nextState, ['error', 'status'])).toEqual({ error: action.payload.message, status: action.type })
    })
  })
})
