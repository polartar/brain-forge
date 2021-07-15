import { get } from 'lodash'

export const selectMappingsState = state => get(state, 'mappings')

export const selectProtocols = state => get(state, 'mappings.protocols')

export const selectProtocolMappings = state => get(state, 'mappings.protocolMappings')

export const selectModalities = state => get(state, 'mappings.modalities')

export const selectModalitiesStatus = state => get(state, 'mappings.status')

export const selectModalitiesError = state => get(state, 'mappings.error')
