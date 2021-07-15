import { handleActions, combineActions } from 'redux-actions'
import { find } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'

import {
  LIST_SITE,
  CREATE_SITE,
  DELETE_SITE,
  GET_SITE,
  SEND_INVITE,
  DELETE_INVITE,
  SET_ADMIN,
  REMOVE_MEMBER,
  LIST_STUDY,
  CREATE_STUDY,
  GET_STUDY,
  UPDATE_STUDY,
  DELETE_STUDY,
  LIST_UPLOADABLE_STUDY,
  LIST_ALL_SCANNER,
  LIST_SCANNER,
  CREATE_SCANNER,
  GET_SCANNER,
  UPDATE_SCANNER,
  DELETE_SCANNER,
  LIST_ALL_SUBJECT,
  CREATE_SUBJECT,
  LIST_ALL_SESSION,
  LIST_SESSION,
  CREATE_SESSION,
  LIST_ALL_SERIES,
  LIST_SERIES,
  CREATE_SERIES,
  LIST_TAG,
  GET_TAG,
  CREATE_TAG,
  UPDATE_TAG,
  DELETE_TAG,
  ASSIGN_TAGS,
} from './actions'

/* Initial state */

const initialState = {
  sites: [],
  site: null,
  studies: [],
  study: null,
  allScanners: [],
  allSubjects: [],
  allSessions: [],
  allSeries: [],
  series: [],
  scanners: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: [],
  },
  scanner: null,
  sessions: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: [],
  },
  tags: [],
  uploadableStudies: [],
  status: 'INIT',
  error: null,
}

export const reducer = handleActions(
  {
    [combineActions(
      LIST_SITE,
      CREATE_SITE,
      DELETE_SITE,
      SEND_INVITE,
      DELETE_INVITE,
      SET_ADMIN,
      REMOVE_MEMBER,
      LIST_STUDY,
      CREATE_STUDY,
      UPDATE_STUDY,
      DELETE_STUDY,
      LIST_UPLOADABLE_STUDY,
      LIST_ALL_SCANNER,
      LIST_SCANNER,
      CREATE_SCANNER,
      GET_SCANNER,
      UPDATE_SCANNER,
      DELETE_SCANNER,
      LIST_ALL_SUBJECT,
      CREATE_SUBJECT,
      LIST_ALL_SESSION,
      LIST_SESSION,
      CREATE_SESSION,
      LIST_ALL_SERIES,
      LIST_SERIES,
      CREATE_SERIES,
      LIST_TAG,
      GET_TAG,
      CREATE_TAG,
      UPDATE_TAG,
      DELETE_TAG,
      ASSIGN_TAGS,
    )]: (state, { type }) => ({
      ...state,
      error: null,
      status: type,
    }),

    [GET_SITE]: (state, { type }) => ({
      ...state,
      site: null,
      error: null,
      status: type,
    }),

    [GET_STUDY]: (state, { type }) => ({
      ...state,
      study: null,
      error: null,
      status: type,
    }),

    [successAction(LIST_SITE)]: (state, { payload, type }) => ({
      ...state,
      sites: payload,
      status: type,
    }),

    [successAction(CREATE_SITE)]: (state, { payload, type }) => ({
      ...state,
      sites: [payload, ...state.sites],
      status: type,
    }),

    [successAction(GET_SITE)]: (state, { payload, type }) => ({
      ...state,
      site: payload,
      status: type,
    }),

    [successAction(DELETE_SITE)]: (state, { payload, type }) => ({
      ...state,
      sites: state.sites.filter(site => site.id !== payload),
      status: type,
    }),

    [successAction(SEND_INVITE)]: (state, { payload, type }) => ({
      ...state,
      site: {
        ...state.site,
        invites: find(state.site.invites, { id: payload.id })
          ? state.site.invites.map(invite => (invite.id === payload.id ? { ...invite, ...payload } : invite))
          : [payload, ...state.site.invites],
      },
      status: type,
    }),

    [successAction(DELETE_INVITE)]: (state, { payload, type }) => ({
      ...state,
      site: {
        ...state.site,
        invites: state.site.invites.filter(invite => invite.id !== payload),
      },
      status: type,
    }),

    [successAction(SET_ADMIN)]: (state, { payload, type }) => ({
      ...state,
      site: {
        ...state.site,
        members: state.site.members.map(member => ({
          ...member,
          site_role: member.id === payload ? 'Admin' : 'Member',
        })),
      },
      status: type,
    }),

    [successAction(REMOVE_MEMBER)]: (state, { payload, type }) => ({
      ...state,
      site: {
        ...state.site,
        members: state.site.members.filter(member => member.id !== payload),
      },
      status: type,
    }),

    [successAction(LIST_STUDY)]: (state, { payload, type }) => ({
      ...state,
      studies: payload,
      status: type,
    }),

    [successAction(CREATE_STUDY)]: (state, { payload, type }) => ({
      ...state,
      studies: [...state.studies, payload],
      status: type,
    }),

    [combineActions(successAction(GET_STUDY), successAction(UPDATE_STUDY))]: (state, { payload, type }) => ({
      ...state,
      studies: state.studies.map(study => (study.id === payload.id ? payload : study)),
      study: payload,
      status: type,
    }),

    [successAction(DELETE_STUDY)]: (state, { payload, type }) => ({
      ...state,
      studies: state.studies.filter(study => study.id !== payload),
      status: type,
    }),

    [successAction(LIST_UPLOADABLE_STUDY)]: (state, { payload, type }) => ({
      ...state,
      uploadableStudies: payload,
      status: type,
    }),

    [successAction(LIST_ALL_SCANNER)]: (state, { payload, type }) => ({
      ...state,
      allScanners: payload,
      status: type,
    }),

    [successAction(LIST_SCANNER)]: (state, { payload, type }) => ({
      ...state,
      scanners: payload,
      status: type,
    }),

    [successAction(CREATE_SCANNER)]: (state, { payload, type }) => ({
      ...state,
      allScanners: [...state.allScanners, payload],
      scanners: {
        ...state.scanners,
        results: [...state.scanners.results, payload],
      },
      status: type,
    }),

    [successAction(GET_SCANNER)]: (state, { payload, type }) => ({
      ...state,
      scanner: payload,
      status: type,
    }),

    [successAction(UPDATE_SCANNER)]: (state, { payload, type }) => ({
      ...state,
      scanners: {
        ...state.scanners,
        results: state.scanners.results.map(scanner => (scanner.id === payload.id ? payload : scanner)),
      },
      status: type,
    }),

    [successAction(DELETE_SCANNER)]: (state, { payload, type }) => ({
      ...state,
      scanners: {
        ...state.scanners,
        results: state.scanners.results.filter(scanner => scanner.id !== payload),
      },
      status: type,
    }),

    [successAction(LIST_ALL_SUBJECT)]: (state, { payload, type }) => ({
      ...state,
      allSubjects: payload,
      status: type,
    }),

    [successAction(CREATE_SUBJECT)]: (state, { payload, type }) => ({
      ...state,
      allSubjects: [...state.allSubjects, payload],
      status: type,
    }),

    [successAction(LIST_ALL_SESSION)]: (state, { payload, type }) => ({
      ...state,
      allSessions: payload,
      status: type,
    }),

    [successAction(LIST_SESSION)]: (state, { payload, type }) => ({
      ...state,
      sessions: payload,
      status: type,
    }),

    [successAction(CREATE_SESSION)]: (state, { payload, type }) => ({
      ...state,
      allSessions: [...state.allSessions, payload],
      status: type,
    }),

    [successAction(LIST_ALL_SERIES)]: (state, { payload, type }) => ({
      ...state,
      allSeries: payload,
      status: type,
    }),

    [successAction(LIST_SERIES)]: (state, { payload, type }) => ({
      ...state,
      series: payload,
      status: type,
    }),

    [successAction(CREATE_SERIES)]: (state, { payload, type }) => ({
      ...state,
      allSeries: [...state.allSeries, payload],
      status: type,
    }),

    [successAction(LIST_TAG)]: (state, { payload, type }) => ({
      ...state,
      tags: payload,
      status: type,
    }),

    [successAction(GET_TAG)]: (state, { payload, type }) => ({
      ...state,
      tag: payload,
      status: type,
    }),

    [successAction(CREATE_TAG)]: (state, { payload, type }) => ({
      ...state,
      tags: [...state.tags, payload],
      status: type,
    }),

    [successAction(UPDATE_TAG)]: (state, { payload, type }) => ({
      ...state,
      tags: state.tags.map(tag => (tag.id === payload.id ? payload : tag)),
      status: type,
    }),

    [successAction(DELETE_TAG)]: (state, { payload, type }) => ({
      ...state,
      tags: state.tags.filter(tag => tag.id !== payload),
      status: type,
    }),

    [successAction(ASSIGN_TAGS)]: (state, { payload, type }) =>
      'study' in payload
        ? {
            ...state,
            studies: state.studies.map(study =>
              study.id === payload.study ? { ...study, tags: payload.tags } : study,
            ),
            status: type,
          }
        : state,

    [combineActions(
      failAction(LIST_SITE),
      failAction(CREATE_SITE),
      failAction(GET_SITE),
      failAction(DELETE_SITE),
      failAction(SEND_INVITE),
      failAction(DELETE_INVITE),
      failAction(SET_ADMIN),
      failAction(REMOVE_MEMBER),
      failAction(LIST_STUDY),
      failAction(CREATE_STUDY),
      failAction(GET_STUDY),
      failAction(UPDATE_STUDY),
      failAction(DELETE_STUDY),
      failAction(LIST_STUDY),
      failAction(CREATE_STUDY),
      failAction(LIST_UPLOADABLE_STUDY),
      failAction(LIST_ALL_SCANNER),
      failAction(LIST_SCANNER),
      failAction(CREATE_SCANNER),
      failAction(GET_SCANNER),
      failAction(UPDATE_SCANNER),
      failAction(DELETE_SCANNER),
      failAction(LIST_ALL_SUBJECT),
      failAction(CREATE_SUBJECT),
      failAction(LIST_ALL_SESSION),
      failAction(LIST_SESSION),
      failAction(CREATE_SESSION),
      failAction(LIST_ALL_SERIES),
      failAction(LIST_SERIES),
      failAction(CREATE_SERIES),
      failAction(LIST_TAG),
      failAction(GET_TAG),
      failAction(CREATE_TAG),
      failAction(UPDATE_TAG),
      failAction(DELETE_TAG),
      failAction(ASSIGN_TAGS),
    )]: (state, { payload, type }) => ({
      ...state,
      error: payload.message,
      status: type,
    }),
  },
  initialState,
)
