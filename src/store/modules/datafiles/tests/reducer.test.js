import { map, pick, values } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'
import { normalizeFileFields } from 'utils/analyses'
import {
  AnalysisFieldsMock,
  FileMock,
  FilesMock,
  ProtocolDataMock,
  ParameterSetMock,
  ParameterSetsMock,
  DataDirectoryMock,
} from 'test/mocks'
import {
  LIST_DATA_FILE,
  GET_DATA_FILE,
  DELETE_DATA_FILE,
  LIST_DATA_DIRECTORY,
  RUN_MULTIPLE_ANALYSES,
  UPLOAD_FILES,
  SET_CURRENT_FILES,
  SET_ALL_FILES,
  INITIALIZE_CURRENT_FILES,
  UPDATE_CURRENT_FILES_FIELD,
  TOGGLE_ALL_CURRENT_FILES_FIELD,
  UPDATE_CURRENT_FILE_FIELDS,
  LIST_PROTOCOL_DATA,
  LIST_PARAMETER_SET,
  CREATE_PARAMETER_SET,
  GET_PARAMETER_SET,
  UPDATE_PARAMETER_SET,
  DELETE_PARAMETER_SET,
  CREATE_ANALYSIS_PLAN,
  UPDATE_ANALYSIS_PLAN,
  DELETE_ANALYSIS_PLAN,
  SET_ANALYSIS_LOCATION,
} from '../actions'
import { reducer } from '../reducer'

const initialState = {
  allFiles: FilesMock(2),
  dataFile: null,
  currentFiles: [
    {
      id: 1,
      fields: AnalysisFieldsMock(),
      object: undefined,
      number_of_rows: 10000,
      options: { splitFile: false, splitType: undefined },
    },
    {
      id: 2,
      fields: AnalysisFieldsMock(),
      object: undefined,
      number_of_rows: 10000,
      options: { splitFile: false, splitType: undefined },
    },
  ],
  dataDirectory: DataDirectoryMock(),
  parameterSets: ParameterSetsMock(),
  parameterSet: ParameterSetMock(),
  protocolData: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: [],
  },
  studies: [],
  sites: [],
  analysisLocation: null,
  status: 'INIT',
  error: null,
}

describe('DataFilesReduer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should return fetching state', () => {
    const actionTypes = [
      LIST_DATA_FILE,
      LIST_DATA_DIRECTORY,
      UPLOAD_FILES,
      RUN_MULTIPLE_ANALYSES,
      LIST_PARAMETER_SET,
      LIST_PROTOCOL_DATA,
      CREATE_PARAMETER_SET,
      GET_PARAMETER_SET,
      UPDATE_PARAMETER_SET,
      DELETE_PARAMETER_SET,
      CREATE_ANALYSIS_PLAN,
      UPDATE_ANALYSIS_PLAN,
      DELETE_ANALYSIS_PLAN,
    ]

    actionTypes.forEach(type => {
      const action = { type }
      const nextState = reducer(initialState, action)

      expect(pick(nextState, ['error', 'status'])).toEqual({ error: null, status: action.type })
    })
  })

  it('should return success state', () => {
    let action = {
      type: successAction(LIST_DATA_FILE),
      payload: [
        {
          file: 'class.csv',
          id: 1,
          name: 'class.csv',
          number_of_rows: 10000,
          fields: {},
        },
      ],
    }
    let nextState = reducer(initialState, action)
    expect(pick(nextState, ['allFiles', 'status'])).toEqual({ allFiles: [...action.payload], status: action.type })

    action = { type: successAction(GET_DATA_FILE), payload: FileMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['dataFile', 'status'])).toEqual({
      dataFile: action.payload,
      status: action.type,
    })

    action = { type: successAction(DELETE_DATA_FILE), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allFiles', 'status'])).toEqual({
      allFiles: initialState.allFiles.filter(file => file.id !== action.payload),
      status: action.type,
    })

    action = {
      type: successAction(LIST_DATA_DIRECTORY),
      payload: 'data directory',
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['dataDirectory', 'status'])).toEqual({
      dataDirectory: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(RUN_MULTIPLE_ANALYSES),
      payload: {
        id: 1,
        PI: 'rjung',
      },
    }
    nextState = reducer(initialState, action)
    expect(nextState.status).toBe(action.type)

    action = {
      type: successAction(UPLOAD_FILES),
      payload: [
        {
          id: 3,
          file: 'class.csv',
          fields: {},
          name: 'File 3',
          number_of_rows: 10000,
        },
      ],
    }
    nextState = reducer(initialState, action)
    const uploadedFiles = map(action.payload, file => normalizeFileFields(file))
    expect(pick(nextState, ['allFiles', 'currentFiles', 'status'])).toEqual({
      allFiles: [...initialState.allFiles, ...uploadedFiles],
      currentFiles: uploadedFiles,
      status: action.type,
    })

    action = {
      type: successAction(LIST_PROTOCOL_DATA),
      payload: values(ProtocolDataMock()),
    }
    nextState = reducer(initialState, action)
    expect(nextState.status).toBe(action.type)

    action = {
      type: successAction(LIST_PARAMETER_SET),
      payload: [
        {
          analysis_type: 1,
          id: 5,
          name: 'fMRI ParameterSet',
        },
      ],
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['parameterSets', 'status'])).toEqual({
      parameterSets: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(GET_PARAMETER_SET),
      payload: {
        analysis_type: 1,
        id: 1,
        name: 'Regression ParameterSet 2',
      },
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['parameterSet', 'status'])).toEqual({
      parameterSet: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(CREATE_PARAMETER_SET),
      payload: {
        analysis_type: 1,
        id: 4,
        name: 'VBM ParameterSet 2',
      },
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['parameterSets', 'status'])).toEqual({
      parameterSets: [action.payload, ...initialState.parameterSets],
      status: action.type,
    })

    action = {
      type: successAction(UPDATE_PARAMETER_SET),
      payload: {
        analysis_type: 1,
        id: 1,
        name: 'Regression ParameterSet 2',
      },
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['parameterSet', 'status'])).toEqual({
      parameterSet: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(DELETE_PARAMETER_SET),
      payload: 2,
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['parameterSets', 'status'])).toEqual({
      parameterSets: initialState.parameterSets.filter(ps => ps.id !== action.payload),
      status: action.type,
    })

    action = {
      type: successAction(CREATE_ANALYSIS_PLAN),
      payload: {
        PI: 'amayer',
        analysis_type: 1,
        id: 13,
        modality: 1,
        parameter_set: 1,
        protocol: 1,
        site: 'human',
        study: 'cobre01_63001',
      },
    }
    nextState = reducer(initialState, action)
    expect(nextState.status).toBe(action.type)

    action = {
      type: successAction(UPDATE_ANALYSIS_PLAN),
      payload: {
        PI: 'amayer',
        analysis_type: 4,
        id: 9,
        modality: 2,
        parameter_set: 4,
        protocol: 1,
        site: 'human',
        study: 'cobre01_63001',
      },
    }
    nextState = reducer(initialState, action)
    expect(nextState.status).toBe(action.type)

    action = {
      type: successAction(DELETE_ANALYSIS_PLAN),
      payload: {
        id: 9,
        protocol: 1,
      },
    }
    nextState = reducer(initialState, action)
    expect(nextState.status).toBe(action.type)
  })

  it('should return fail state', () => {
    const actionTypes = [
      LIST_DATA_FILE,
      LIST_DATA_DIRECTORY,
      RUN_MULTIPLE_ANALYSES,
      UPLOAD_FILES,
      LIST_PROTOCOL_DATA,
      LIST_PARAMETER_SET,
      CREATE_PARAMETER_SET,
      UPDATE_PARAMETER_SET,
      DELETE_PARAMETER_SET,
      CREATE_ANALYSIS_PLAN,
      UPDATE_ANALYSIS_PLAN,
      DELETE_ANALYSIS_PLAN,
    ]

    actionTypes.forEach(type => {
      const action = { type: failAction(type), payload: { message: type } }
      const nextState = reducer(initialState, action)

      expect(pick(nextState, ['error', 'status'])).toEqual({ error: action.payload.message, status: action.type })
    })
  })

  it('should set current files', () => {
    const action = {
      type: SET_CURRENT_FILES,
      payload: [
        {
          id: 1,
          object: 'object',
          fields: {
            0: { index: 0, selected: true, type: 'feature' },
            1: { index: 1, selected: false, type: 'response' },
          },
          number_of_rows: 10,
        },
      ],
    }
    const nextState = reducer(initialState, action)
    expect(nextState.status).toBe(action.type)
  })

  it('should set all files', () => {
    const action = {
      type: SET_ALL_FILES,
      payload: [
        {
          id: 1,
          object: 'object',
          fields: {
            0: { index: 0, selected: true, type: 'feature' },
            1: { index: 1, selected: false, type: 'response' },
          },
          number_of_rows: 10,
        },
      ],
    }
    const nextState = reducer(initialState, action)

    expect(nextState.status).toEqual(action.type)
  })

  it('should toggle all current files field', () => {
    const action = { type: TOGGLE_ALL_CURRENT_FILES_FIELD, payload: true }
    const nextState = reducer(initialState, action)

    expect(nextState.status).toBe(action.type)
  })

  it('should update current files field', () => {
    const action = { type: UPDATE_CURRENT_FILES_FIELD, payload: { index: 1, field: { variable_role: 'y' } } }
    const nextState = reducer(initialState, action)

    expect(nextState.status).toBe(action.type)
  })

  it('should update current file fields', () => {
    const action = { type: UPDATE_CURRENT_FILE_FIELDS, payload: { file: 1, fields: { datatype: 'string' } } }
    const nextState = reducer(initialState, action)

    expect(nextState.status).toBe(action.type)
  })

  it('should initialize selected file', () => {
    const action = { type: INITIALIZE_CURRENT_FILES }
    const nextState = reducer(initialState, action)

    expect(pick(nextState, ['currentFiles', 'status'])).toEqual({
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
      status: action.type,
    })
  })

  it('should set anlaysis location', () => {
    const action = { type: SET_ANALYSIS_LOCATION, payload: '/analysis-start/1' }
    const nextState = reducer(initialState, action)
    expect(pick(nextState, ['analysisLocation', 'status'])).toEqual({
      analysisLocation: action.payload,
      status: action.type,
    })
  })
})
