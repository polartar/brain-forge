import { createAction } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'

/**
 * Constants
 */
export const LIST_PROTOCOL = 'LIST_PROTOCOL'

export const LIST_PROTOCOL_MAPPING = 'LIST_PROTOCOL_MAPPING'
export const CREATE_PROTOCOL_MAPPING = 'CREATE_PROTOCOL_MAPPING'
export const UPDATE_PROTOCOL_MAPPING = 'UPDATE_PROTOCOL_MAPPING'
export const DELETE_PROTOCOL_MAPPING = 'DELETE_PROTOCOL_MAPPING'

export const LIST_MODALITY = 'LIST_MODALITY'

/**
 * Action creators
 */
export const listProtocol = createAction(LIST_PROTOCOL)
export const listProtocolSuccess = createAction(successAction(LIST_PROTOCOL))
export const listProtocolFail = createAction(failAction(LIST_PROTOCOL))

export const listProtocolMapping = createAction(LIST_PROTOCOL_MAPPING)
export const listProtocolMappingSuccess = createAction(successAction(LIST_PROTOCOL_MAPPING))
export const listProtocolMappingFail = createAction(failAction(LIST_PROTOCOL_MAPPING))

export const createProtocolMapping = createAction(CREATE_PROTOCOL_MAPPING)
export const createProtocolMappingSuccess = createAction(successAction(CREATE_PROTOCOL_MAPPING))
export const createProtocolMappingFail = createAction(failAction(CREATE_PROTOCOL_MAPPING))

export const updateProtocolMapping = createAction(UPDATE_PROTOCOL_MAPPING)
export const updateProtocolMappingSuccess = createAction(successAction(UPDATE_PROTOCOL_MAPPING))
export const updateProtocolMappingFail = createAction(failAction(UPDATE_PROTOCOL_MAPPING))

export const deleteProtocolMapping = createAction(DELETE_PROTOCOL_MAPPING)
export const deleteProtocolMappingSuccess = createAction(successAction(DELETE_PROTOCOL_MAPPING))
export const deleteProtocolMappingFail = createAction(failAction(DELETE_PROTOCOL_MAPPING))

export const listModality = createAction(LIST_MODALITY)
export const listModalitySuccess = createAction(successAction(LIST_MODALITY))
export const listModalityFail = createAction(failAction(LIST_MODALITY))
