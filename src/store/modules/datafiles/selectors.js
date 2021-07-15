import { get } from 'lodash'

export const selectDataFilesState = state => get(state, 'datafiles')

export const selectAllFiles = state => get(state, 'datafiles.allFiles')

export const selectDataFile = state => get(state, 'datafiles.dataFile')

export const selectDataDirectory = state => get(state, 'datafiles.dataDirectory')

export const selectCurrentFiles = state => get(state, 'datafiles.currentFiles')

export const selectProtocolData = state => get(state, 'datafiles.protocolData')

export const selectParameterSets = state => get(state, 'datafiles.parameterSets')

export const selectParameterSet = state => get(state, 'datafiles.parameterSet')

export const selectAnalysisLocation = state => get(state, 'datafiles.analysisLocation')

export const selectMetadataFiles = state => get(state, 'datafiles.metadataFiles')

export const selectMetadata = state => get(state, 'datafiles.metadata')

export const selectMiscFile = state => get(state, 'datafiles.miscFile')

export const selectDataFilesStatus = state => get(state, 'datafiles.status')

export const selectDataFilesError = state => get(state, 'datafiles.error')
