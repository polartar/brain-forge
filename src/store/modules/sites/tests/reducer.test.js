import { pick } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'
import {
  SitesMock,
  SiteMock,
  StudiesMock,
  StudyMock,
  ScannersMock,
  ScannerMock,
  SubjectsMock,
  SubjectMock,
  SessionsMock,
  SessionMock,
  MultipleSeriesMock,
  SeriesMock,
  SummarySessionsMock,
  TagMock,
  TagsMock,
} from 'test/mocks'
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
} from '../actions'
import { reducer } from '../reducer'

const initialState = {
  sites: SitesMock(3),
  site: SiteMock(1),
  studies: StudiesMock(3),
  study: StudyMock(1),
  allScanners: ScannersMock(2),
  allSubjects: SubjectsMock(2),
  allSessions: SessionsMock(2),
  allSeries: MultipleSeriesMock(2),
  scanners: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: ScannersMock(2),
  },
  sessions: {
    pageSize: 10,
    currentPage: 1,
    totalCount: 0,
    results: SummarySessionsMock(),
  },
  uploadableStudies: [],
  series: [],
  tags: TagsMock(),
  tag: null,
  status: 'INIT',
  error: null,
}

describe('SitesReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should return fetching state', () => {
    const actionTypes = [
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
    ]

    actionTypes.forEach(type => {
      const nextState = reducer(initialState, { type })
      expect(pick(nextState, ['error', 'status'])).toEqual({ error: null, status: type })
    })

    let nextState = reducer(initialState, { type: GET_SITE })
    expect(pick(nextState, ['site', 'error', 'status'])).toEqual({ site: null, error: null, status: GET_SITE })

    nextState = reducer(initialState, { type: GET_STUDY })
    expect(pick(nextState, ['study', 'error', 'status'])).toEqual({ study: null, error: null, status: GET_STUDY })
  })

  it('should return success state', () => {
    let action = { type: successAction(LIST_SITE), payload: SitesMock(2) }
    let nextState = reducer(initialState, action)
    expect(pick(nextState, ['sites', 'status'])).toEqual({
      sites: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_SITE), payload: SiteMock(3) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['sites', 'status'])).toEqual({
      sites: [action.payload, ...initialState.sites],
      status: action.type,
    })

    action = { type: successAction(GET_SITE), payload: SiteMock(1) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: action.payload,
      status: action.type,
    })

    action = { type: successAction(DELETE_SITE), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['sites', 'status'])).toEqual({
      sites: initialState.sites.filter(site => site.id !== action.payload),
      status: action.type,
    })

    action = { type: successAction(SEND_INVITE), payload: { id: 1, email: 'john@email.com' } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        invites: initialState.site.invites.map(invite =>
          invite.id === action.payload.id ? { ...invite, ...action.payload } : invite,
        ),
      },
      status: action.type,
    })

    action = { type: successAction(SEND_INVITE), payload: { id: 6, email: 'john@email.com' } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        invites: [action.payload, ...initialState.site.invites],
      },
      status: action.type,
    })

    action = { type: successAction(DELETE_INVITE), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        invites: initialState.site.invites.filter(invite => invite.id !== action.payload),
      },
      status: action.type,
    })

    action = { type: successAction(SET_ADMIN), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        members: initialState.site.members.map(member => ({
          ...member,
          site_role: member.id === action.payload ? 'Admin' : 'Member',
        })),
      },
      status: action.type,
    })

    action = { type: successAction(REMOVE_MEMBER), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        members: initialState.site.members.filter(member => member.id !== action.payload),
      },
      status: action.type,
    })

    action = { type: successAction(LIST_STUDY), payload: StudiesMock(3) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['studies', 'status'])).toEqual({
      studies: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_STUDY), payload: StudyMock(1) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['studies', 'status'])).toEqual({
      studies: [...initialState.studies, action.payload],
      status: action.type,
    })

    let actionNames = [GET_STUDY, UPDATE_STUDY]
    actionNames.forEach(actionName => {
      action = { type: successAction(actionName), payload: StudyMock(1) }
      nextState = reducer(initialState, action)
      expect(pick(nextState, ['study', 'status'])).toEqual({
        study: action.payload,
        status: action.type,
      })
    })

    action = { type: successAction(DELETE_STUDY), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['studies', 'status'])).toEqual({
      studies: initialState.studies.filter(study => study.id !== action.payload),
      status: action.type,
    })

    action = { type: successAction(LIST_UPLOADABLE_STUDY), payload: StudiesMock(5) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['uploadableStudies', 'status'])).toEqual({
      uploadableStudies: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_ALL_SCANNER), payload: ScannersMock(4) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allScanners', 'status'])).toEqual({
      allScanners: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(LIST_SCANNER),
      payload: {
        pageSize: 3,
        currentPage: 1,
        totalCount: 3,
        results: ScannersMock(3),
      },
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['scanners', 'status'])).toEqual({
      scanners: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_SCANNER), payload: ScannerMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allScanners', 'scanners', 'status'])).toEqual({
      allScanners: [...initialState.allScanners, action.payload],
      scanners: {
        ...initialState.scanners,
        results: [...initialState.scanners.results, action.payload],
      },
      status: action.type,
    })

    action = { type: successAction(GET_SCANNER), payload: ScannerMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['scanner', 'status'])).toEqual({
      scanner: action.payload,
      status: action.type,
    })

    action = { type: successAction(UPDATE_SCANNER), payload: { ...ScannerMock(1), label: 'scanner-2' } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['scanners', 'status'])).toEqual({
      scanners: {
        ...initialState.scanners,
        results: initialState.scanners.results.map(scanner =>
          scanner.id === action.payload.id ? action.payload : scanner,
        ),
      },
      status: action.type,
    })

    action = { type: successAction(DELETE_SCANNER), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['scanners', 'status'])).toEqual({
      scanners: {
        ...initialState.scanners,
        results: initialState.scanners.results.filter(scanner => scanner.id !== action.payload),
      },
      status: action.type,
    })

    action = { type: successAction(LIST_ALL_SUBJECT), payload: SubjectsMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allSubjects', 'status'])).toEqual({
      allSubjects: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_SUBJECT), payload: SubjectMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allSubjects', 'status'])).toEqual({
      allSubjects: [...initialState.allSubjects, action.payload],
      status: action.type,
    })

    action = { type: successAction(LIST_ALL_SESSION), payload: SessionsMock(4) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allSessions', 'status'])).toEqual({
      allSessions: action.payload,
      status: action.type,
    })

    action = {
      type: successAction(LIST_SESSION),
      payload: {
        pageSize: 3,
        currentPage: 1,
        totalCount: 3,
        results: SummarySessionsMock(3),
      },
    }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['sessions', 'status'])).toEqual({
      sessions: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_SESSION), payload: SessionMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allSessions', 'status'])).toEqual({
      allSessions: [...initialState.allSessions, action.payload],
      status: action.type,
    })

    action = { type: successAction(LIST_ALL_SERIES), payload: MultipleSeriesMock(4) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allSeries', 'status'])).toEqual({
      allSeries: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_SERIES), payload: SeriesMock(1) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['series', 'status'])).toEqual({
      series: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_SERIES), payload: SeriesMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['allSeries', 'status'])).toEqual({
      allSeries: [...initialState.allSeries, action.payload],
      status: action.type,
    })

    action = { type: successAction(LIST_TAG), payload: TagsMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['tags', 'status'])).toEqual({
      tags: action.payload,
      status: action.type,
    })

    action = { type: successAction(GET_TAG), payload: TagMock() }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['tag', 'status'])).toEqual({
      tag: action.payload,
      status: action.type,
    })

    action = { type: successAction(CREATE_TAG), payload: TagMock(4) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['tags', 'status'])).toEqual({
      tags: [...initialState.tags, action.payload],
      status: action.type,
    })

    action = { type: successAction(UPDATE_TAG), payload: { ...TagMock(2), label: 'tag-2' } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['tags', 'status'])).toEqual({
      tags: initialState.tags.map(tag => (tag.id === action.payload.id ? action.payload : tag)),
      status: action.type,
    })

    action = { type: successAction(DELETE_TAG), payload: 3 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['tags', 'status'])).toEqual({
      tags: initialState.tags.filter(tag => tag.id !== action.payload),
      status: action.type,
    })

    action = { type: successAction(ASSIGN_TAGS), payload: { study: 1, tags: TagsMock() } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['studies', 'status'])).toEqual({
      studies: initialState.studies.map(study =>
        study.id === action.payload.study ? { ...study, tags: action.payload.tags } : study,
      ),
      status: action.type,
    })

    action = { type: successAction(ASSIGN_TAGS), payload: { session: 1, tags: TagsMock() } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['studies'])).toEqual({
      studies: initialState.studies,
    })
  })

  it('should return fail state', () => {
    const actionTypes = [
      LIST_SITE,
      CREATE_SITE,
      GET_SITE,
      DELETE_SITE,
      SEND_INVITE,
      DELETE_INVITE,
      SET_ADMIN,
      REMOVE_MEMBER,
      LIST_STUDY,
      CREATE_STUDY,
      GET_STUDY,
      UPDATE_STUDY,
      DELETE_STUDY,
      LIST_STUDY,
      CREATE_STUDY,
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
    ]

    actionTypes.forEach(type => {
      const action = { type: failAction(type), payload: { message: type } }
      const nextState = reducer(initialState, action)

      expect(pick(nextState, ['error', 'status'])).toEqual({ error: action.payload.message, status: action.type })
    })
  })
})
