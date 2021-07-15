import {
  selectDataFilesState,
  selectAllFiles,
  selectDataFile,
  selectDataDirectory,
  selectCurrentFiles,
  selectProtocolData,
  selectParameterSets,
  selectParameterSet,
  selectAnalysisLocation,
  selectMetadataFiles,
  selectMetadata,
  selectDataFilesStatus,
  selectDataFilesError,
} from '../selectors'

const state = {
  datafiles: {
    allFiles: [],
    dataFile: null,
    currentFiles: [
      {
        id: undefined,
        object: undefined,
        fields: {},
        options: {
          splitFile: false,
          splitType: undefined,
        },
      },
    ],
    dataDirectory: {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      results: [],
    },
    parameterSets: [],
    protocolData: {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      results: [],
    },
    analysisLocation: null,
    metadataFiles: [],
    metadata: null,
    status: 'INIT',
    error: null,
  },
}

describe('DataFile selectors', () => {
  it('tests', () => {
    const { datafiles } = state

    expect(selectDataFilesState(state)).toEqual(datafiles)
    expect(selectAllFiles(state)).toEqual(datafiles.allFiles)
    expect(selectDataFile(state)).toEqual(datafiles.dataFile)
    expect(selectDataDirectory(state)).toEqual(datafiles.dataDirectory)
    expect(selectCurrentFiles(state)).toEqual(datafiles.currentFiles)
    expect(selectProtocolData(state)).toEqual(datafiles.protocolData)
    expect(selectParameterSets(state)).toEqual(datafiles.parameterSets)
    expect(selectParameterSet(state)).toEqual(datafiles.parameterSet)
    expect(selectAnalysisLocation(state)).toEqual(datafiles.analysisLocation)
    expect(selectMetadataFiles(state)).toEqual(datafiles.metadataFiles)
    expect(selectMetadata(state)).toEqual(datafiles.metadata)
    expect(selectDataFilesStatus(state)).toEqual(datafiles.status)
    expect(selectDataFilesError(state)).toEqual(datafiles.error)
  })
})
