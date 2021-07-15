import { handleActions, combineActions } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'

import {
  LIST_PROTOCOL,
  LIST_PROTOCOL_MAPPING,
  CREATE_PROTOCOL_MAPPING,
  UPDATE_PROTOCOL_MAPPING,
  DELETE_PROTOCOL_MAPPING,
  LIST_MODALITY,
} from './actions'

/* Initial state */

const initialState = {
  protocols: [],
  protocolMappings: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: [],
  },
  modalities: [],
  status: 'INIT',
  error: null,
}

export const reducer = handleActions(
  {
    [combineActions(
      LIST_PROTOCOL,
      LIST_PROTOCOL_MAPPING,
      CREATE_PROTOCOL_MAPPING,
      UPDATE_PROTOCOL_MAPPING,
      DELETE_PROTOCOL_MAPPING,
      LIST_MODALITY,
    )]: (state, { type }) => ({
      ...state,
      error: null,
      status: type,
    }),

    [successAction(LIST_PROTOCOL)]: (state, { payload, type }) => ({
      ...state,
      protocols: payload,
      status: type,
    }),

    [successAction(LIST_PROTOCOL_MAPPING)]: (state, { payload, type }) => ({
      ...state,
      protocolMappings: payload,
      status: type,
    }),

    [successAction(CREATE_PROTOCOL_MAPPING)]: (state, { payload, type }) => ({
      ...state,
      status: type,
    }),

    [successAction(UPDATE_PROTOCOL_MAPPING)]: (state, { payload, type }) => ({
      ...state,
      protocolMappings: {
        ...state.protocolMappings,
        results: state.protocolMappings.results.map(mapping => (mapping.id === payload.id ? payload : mapping)),
      },
      status: type,
    }),

    [successAction(DELETE_PROTOCOL_MAPPING)]: (state, { payload, type }) => ({
      ...state,
      protocolMappings: {
        ...state.protocolMappings,
        results: state.protocolMappings.results.filter(mapping => mapping.id !== payload),
      },
      status: type,
    }),

    [successAction(LIST_MODALITY)]: (state, { payload, type }) => ({
      ...state,
      modalities: payload,
      status: type,
    }),

    [combineActions(
      failAction(LIST_PROTOCOL),
      failAction(LIST_PROTOCOL_MAPPING),
      failAction(CREATE_PROTOCOL_MAPPING),
      failAction(UPDATE_PROTOCOL_MAPPING),
      failAction(DELETE_PROTOCOL_MAPPING),
      failAction(LIST_MODALITY),
    )]: (state, { payload, type }) => ({
      ...state,
      error: payload.message,
      status: type,
    }),
  },
  initialState,
)
