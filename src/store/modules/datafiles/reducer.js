import update from 'immutability-helper'
import { filter, get, map, mapValues } from 'lodash'
import { MANAGED_SOURCE } from 'config/base'
import { handleActions, combineActions } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'
import { normalizeFileFields } from 'utils/analyses'

import { ASSIGN_TAGS } from 'store/modules/sites'
import {
  LIST_DATA_FILE,
  GET_DATA_FILE,
  DELETE_DATA_FILE,
  LIST_DATA_DIRECTORY,
  RUN_MULTIPLE_ANALYSES,
  RUN_SINGLE_ANALYSIS,
  UPLOAD_FILES,
  UPLOAD_MISC_FILES,
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
  CLEAR_PROTOCOL_DATA,
  SET_ANALYSIS_LOCATION,
  LIST_METADATA,
  GET_METADATA,
  LIST_MISC_FILE,
} from './actions'
import { DELETE_ANALYSIS } from '../analyses'

/* Initial state */

const initialState = {
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
  metadataFiles: {},
  metadata: null,
  tags: [],
  status: 'INIT',
  error: null,
}

export const reducer = handleActions(
  {
    [combineActions(
      LIST_DATA_FILE,
      GET_DATA_FILE,
      DELETE_DATA_FILE,
      LIST_DATA_DIRECTORY,
      UPLOAD_FILES,
      UPLOAD_MISC_FILES,
      RUN_MULTIPLE_ANALYSES,
      RUN_SINGLE_ANALYSIS,
      LIST_PARAMETER_SET,
      CREATE_PARAMETER_SET,
      GET_PARAMETER_SET,
      UPDATE_PARAMETER_SET,
      DELETE_PARAMETER_SET,
      CREATE_ANALYSIS_PLAN,
      UPDATE_ANALYSIS_PLAN,
      DELETE_ANALYSIS_PLAN,
      LIST_METADATA,
      GET_METADATA,
      LIST_MISC_FILE,
    )]: (state, { type }) => ({
      ...state,
      error: null,
      status: type,
    }),

    [CLEAR_PROTOCOL_DATA]: (state, { type }) => ({
      ...state,
      protocolData: initialState.protocolData,
      status: type,
    }),

    [LIST_PROTOCOL_DATA]: (state, { type }) => ({
      ...state,
      error: null,
      status: type,
    }),

    [successAction(LIST_DATA_FILE)]: (state, { payload, type }) => {
      const managedFiles = filter(state.allFiles, { source: MANAGED_SOURCE })
      const newUploadedFiles = map(payload, normalizeFileFields)
      const newState = update(state, {
        allFiles: { $set: [...managedFiles, ...newUploadedFiles] },
        status: { $set: type },
      })

      return newState
    },

    [successAction(GET_DATA_FILE)]: (state, { payload, type }) => ({
      ...state,
      dataFile: payload,
      status: type,
    }),

    [successAction(DELETE_DATA_FILE)]: (state, { payload, type }) => ({
      ...state,
      allFiles: state.allFiles.filter(file => file.id !== payload),
      status: type,
    }),

    [successAction(LIST_DATA_DIRECTORY)]: (state, { payload, type }) => {
      const newState = update(state, {
        dataDirectory: { $set: payload },
        status: { $set: type },
      })

      return newState
    },

    [successAction(DELETE_ANALYSIS)]: (state, { payload, type }) => {
      const { dataDirectory } = state

      const newState = update(state, {
        dataDirectory: {
          results: {
            $set: dataDirectory.results.map(study => ({
              ...study,
              analyses: study.analyses.filter(analysis => analysis.id !== payload),
            })),
          },
        },
      })

      return newState
    },

    [combineActions(successAction(RUN_MULTIPLE_ANALYSES), successAction(RUN_SINGLE_ANALYSIS))]: (
      state,
      { payload, type },
    ) => {
      const newState = update(state, {
        dataDirectory: {
          results: { $set: state.dataDirectory.results.map(result => (result.id !== payload.id ? result : payload)) },
        },
        status: { $set: type },
      })

      return newState
    },

    [successAction(UPLOAD_FILES)]: (state, { payload, type }) => {
      const uploadedFiles = map(payload, file => normalizeFileFields(file))
      const newState = update(state, {
        allFiles: {
          $push: uploadedFiles,
        },
        currentFiles: { $set: uploadedFiles },
        status: { $set: type },
      })

      return newState
    },

    [successAction(UPLOAD_MISC_FILES)]: (state, { payload, type }) => {
      const uploadedFiles = map(payload, file => normalizeFileFields(file))
      const newState = update(state, {
        allFiles: {
          $push: uploadedFiles,
        },
        currentFiles: { $set: uploadedFiles },
        status: { $set: type },
      })

      return newState
    },

    [successAction(LIST_PROTOCOL_DATA)]: (state, { payload, type }) => ({
      ...state,
      protocolData: payload,
      status: type,
    }),

    [successAction(LIST_PARAMETER_SET)]: (state, { payload, type }) => ({
      ...state,
      parameterSets: payload,
      status: type,
    }),

    [successAction(GET_PARAMETER_SET)]: (state, { payload, type }) => ({
      ...state,
      parameterSet: payload,
      status: type,
    }),

    [successAction(CREATE_PARAMETER_SET)]: (state, { payload, type }) => ({
      ...state,
      parameterSets: [payload, ...state.parameterSets],
      status: type,
    }),

    [successAction(UPDATE_PARAMETER_SET)]: (state, { payload, type }) => ({
      ...state,
      parameterSet: payload,
      parameterSets: state.parameterSets.map(parameterSet => (parameterSet.id === payload.id ? payload : parameterSet)),
      status: type,
    }),

    [successAction(DELETE_PARAMETER_SET)]: (state, { payload, type }) => ({
      ...state,
      parameterSets: state.parameterSets.filter(ps => ps.id !== payload),
      status: type,
    }),

    [successAction(LIST_METADATA)]: (state, { payload, type }) => ({
      ...state,
      metadataFiles: payload,
      status: type,
    }),

    [successAction(GET_METADATA)]: (state, { payload, type }) => ({
      ...state,
      metadata: payload,
      status: type,
    }),

    [successAction(LIST_MISC_FILE)]: (state, { payload, type }) => ({
      ...state,
      miscFile: payload,
      status: type,
    }),

    [successAction(CREATE_ANALYSIS_PLAN)]: (state, { payload, type }) => ({
      ...state,
      dataDirectory: {
        ...state.dataDirectory,
        results: state.dataDirectory.results.map(study =>
          get(study, 'series.protocol.id') === payload.protocol
            ? {
                ...study,
                plans: [...study.plans, payload],
              }
            : study,
        ),
      },
      protocolData: {
        ...state.protocolData,
        results: state.protocolData.results.map(protocol =>
          protocol.id === payload.protocol
            ? {
                ...protocol,
                plans: [...protocol.plans, payload],
              }
            : protocol,
        ),
      },
      status: type,
    }),

    [successAction(UPDATE_ANALYSIS_PLAN)]: (state, { payload, type }) => ({
      ...state,
      dataDirectory: {
        ...state.dataDirectory,
        results: state.dataDirectory.results.map(study =>
          get(study, 'series.protocol.id') === payload.protocol
            ? {
                ...study,
                plans: study.plans.map(plan => (plan.id === payload.id ? payload : plan)),
              }
            : study,
        ),
      },
      protocolData: {
        ...state.protocolData,
        results: state.protocolData.results.map(protocol =>
          protocol.id === payload.protocol
            ? {
                ...protocol,
                plans: protocol.plans.map(plan => (plan.id === payload.id ? payload : plan)),
              }
            : protocol,
        ),
      },
      status: type,
    }),

    [successAction(DELETE_ANALYSIS_PLAN)]: (state, { payload, type }) => ({
      ...state,
      dataDirectory: {
        ...state.dataDirectory,
        results: state.dataDirectory.results.map(study =>
          get(study, 'series.protocol.id') === payload.protocol
            ? {
                ...study,
                plans: study.plans.filter(plan => plan.id !== payload.id),
              }
            : study,
        ),
      },
      protocolData: {
        ...state.protocolData,
        results: state.protocolData.results.map(protocol =>
          protocol.id === payload.protocol
            ? {
                ...protocol,
                plans: protocol.plans.filter(plan => plan.id !== payload.id),
              }
            : protocol,
        ),
      },
      status: type,
    }),

    [successAction(ASSIGN_TAGS)]: (state, { payload }) => {
      if ('subject' in payload || 'session' in payload) {
        const key = 'subject' in payload ? 'subject' : 'session'
        const info = `${key}_info`

        return update(state, {
          dataDirectory: {
            results: {
              $set: state.dataDirectory.results.map(datafile =>
                datafile[info].id === payload[key]
                  ? {
                      ...datafile,
                      [info]: {
                        ...datafile[info],
                        tags: payload.tags,
                      },
                    }
                  : datafile,
              ),
            },
          },
        })
      }

      return state
    },

    [combineActions(
      failAction(LIST_DATA_FILE),
      failAction(GET_DATA_FILE),
      failAction(DELETE_DATA_FILE),
      failAction(LIST_DATA_DIRECTORY),
      failAction(RUN_MULTIPLE_ANALYSES),
      failAction(RUN_SINGLE_ANALYSIS),
      failAction(UPLOAD_FILES),
      failAction(UPLOAD_MISC_FILES),
      failAction(LIST_PARAMETER_SET),
      failAction(LIST_PROTOCOL_DATA),
      failAction(CREATE_PARAMETER_SET),
      failAction(GET_PARAMETER_SET),
      failAction(UPDATE_PARAMETER_SET),
      failAction(DELETE_PARAMETER_SET),
      failAction(CREATE_ANALYSIS_PLAN),
      failAction(UPDATE_ANALYSIS_PLAN),
      failAction(DELETE_ANALYSIS_PLAN),
      failAction(LIST_METADATA),
      failAction(GET_METADATA),
      failAction(LIST_MISC_FILE),
    )]: (state, { payload, type }) => ({
      ...state,
      error: payload.message,
      status: type,
    }),

    [SET_CURRENT_FILES]: (state, { payload, type }) => {
      const newState = update(state, {
        currentFiles: { $set: map(payload, normalizeFileFields) },
        status: { $set: type },
      })

      return newState
    },

    [SET_ALL_FILES]: (state, { payload, type }) => {
      const newState = update(state, {
        allFiles: { $set: map(payload, normalizeFileFields) },
        status: { $set: type },
      })

      return newState
    },

    [TOGGLE_ALL_CURRENT_FILES_FIELD]: (state, { payload, type }) => {
      const newState = update(state, {
        currentFiles: [
          {
            fields: {
              $apply: fields =>
                mapValues(fields, field =>
                  update(field, {
                    selected: { $set: payload },
                  }),
                ),
            },
          },
        ],
        status: { $set: type },
      })

      return newState
    },

    [UPDATE_CURRENT_FILES_FIELD]: (state, { payload, type }) => {
      const newState = update(state, {
        currentFiles: [
          {
            fields: {
              $apply: fields =>
                mapValues(fields, field =>
                  field.index === payload.index ? update(field, { $merge: payload.field }) : field,
                ),
            },
          },
        ],
        status: { $set: type },
      })
      return newState
    },

    [UPDATE_CURRENT_FILE_FIELDS]: (state, { payload, type }) => {
      const newState = update(state, {
        currentFiles: {
          $apply: files =>
            map(files, file => (file.id === payload.file ? update(file, { fields: { $set: payload.fields } }) : file)),
        },
        status: { $set: type },
      })
      return newState
    },

    [INITIALIZE_CURRENT_FILES]: (state, { type }) => ({
      ...state,
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
      status: type,
    }),

    [SET_ANALYSIS_LOCATION]: (state, { payload, type }) => ({
      ...state,
      analysisLocation: payload,
      status: type,
    }),
  },
  initialState,
)
