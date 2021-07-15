import { createAction } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'

/**
 * Constants
 */
export const LIST_SITE = 'LIST_SITE'
export const CREATE_SITE = 'CREATE_SITE'
export const GET_SITE = 'GET_SITE'
export const DELETE_SITE = 'DELETE_SITE'

export const SEND_INVITE = 'SEND_INVITE'
export const DELETE_INVITE = 'DELETE_INVITE'

export const SET_ADMIN = 'SET_ADMIN'

export const REMOVE_MEMBER = 'REMOVE_MEMBER'

export const LIST_STUDY = 'LIST_STUDY'
export const CREATE_STUDY = 'CREATE_STUDY'
export const GET_STUDY = 'GET_STUDY'
export const UPDATE_STUDY = 'UPDATE_STUDY'
export const DELETE_STUDY = 'DELETE_STUDY'
export const LIST_UPLOADABLE_STUDY = 'LIST_UPLOADABLE_STUDY'

export const LIST_ALL_SCANNER = 'LIST_ALL_SCANNER'
export const LIST_SCANNER = 'LIST_SCANNER'
export const CREATE_SCANNER = 'CREATE_SCANNER'
export const GET_SCANNER = 'GET_SCANNER'
export const UPDATE_SCANNER = 'UPDATE_SCANNER'
export const DELETE_SCANNER = 'DELETE_SCANNER'

export const LIST_ALL_SUBJECT = 'LIST_ALL_SUBJECT'
export const CREATE_SUBJECT = 'CREATE_SUBJECT'

export const LIST_ALL_SESSION = 'LIST_ALL_SESSION'
export const LIST_SESSION = 'LIST_SESSION'
export const CREATE_SESSION = 'CREATE_SESSION'

export const LIST_ALL_SERIES = 'LIST_ALL_SERIES'
export const LIST_SERIES = 'LIST_SERIES'
export const CREATE_SERIES = 'CREATE_SERIES'

export const LIST_TAG = 'LIST_TAG'
export const GET_TAG = 'GET_TAG'
export const CREATE_TAG = 'CREATE_TAG'
export const UPDATE_TAG = 'UPDATE_TAG'
export const DELETE_TAG = 'DELETE_TAG'
export const ASSIGN_TAGS = 'ASSIGN_TAGS'

export const GET_PREPROCESSING_SUMMARY = 'GET_PREPROCESSING_SUMMARY'

/**
 * Action creators
 */
export const listSite = createAction(LIST_SITE)
export const listSiteSuccess = createAction(successAction(LIST_SITE))
export const listSiteFail = createAction(failAction(LIST_SITE))

export const createSite = createAction(CREATE_SITE)
export const createSiteSuccess = createAction(successAction(CREATE_SITE))
export const createSiteFail = createAction(failAction(CREATE_SITE))

export const getSite = createAction(GET_SITE)
export const getSiteSuccess = createAction(successAction(GET_SITE))
export const getSiteFail = createAction(failAction(GET_SITE))

export const deleteSite = createAction(DELETE_SITE)
export const deleteSiteSuccess = createAction(successAction(DELETE_SITE))
export const deleteSiteFail = createAction(failAction(DELETE_SITE))

export const sendInvite = createAction(SEND_INVITE)
export const sendInviteSuccess = createAction(successAction(SEND_INVITE))
export const sendInviteFail = createAction(failAction(SEND_INVITE))

export const deleteInvite = createAction(DELETE_INVITE)
export const deleteInviteSuccess = createAction(successAction(DELETE_INVITE))
export const deleteInviteFail = createAction(failAction(DELETE_INVITE))

export const setAdmin = createAction(SET_ADMIN)
export const setAdminSuccess = createAction(successAction(SET_ADMIN))
export const setAdminFail = createAction(failAction(SET_ADMIN))

export const removeMember = createAction(REMOVE_MEMBER)
export const removeMemberSuccess = createAction(successAction(REMOVE_MEMBER))
export const removeMemberFail = createAction(failAction(REMOVE_MEMBER))

export const listStudy = createAction(LIST_STUDY)
export const listStudySuccess = createAction(successAction(LIST_STUDY))
export const listStudyFail = createAction(failAction(LIST_STUDY))

export const createStudy = createAction(CREATE_STUDY)
export const createStudySuccess = createAction(successAction(CREATE_STUDY))
export const createStudyFail = createAction(failAction(CREATE_STUDY))

export const getStudy = createAction(GET_STUDY)
export const getStudySuccess = createAction(successAction(GET_STUDY))
export const getStudyFail = createAction(failAction(GET_STUDY))

export const updateStudy = createAction(UPDATE_STUDY)
export const updateStudySuccess = createAction(successAction(UPDATE_STUDY))
export const updateStudyFail = createAction(failAction(UPDATE_STUDY))

export const deleteStudy = createAction(DELETE_STUDY)
export const deleteStudySuccess = createAction(successAction(DELETE_STUDY))
export const deleteStudyFail = createAction(failAction(DELETE_STUDY))

export const listUploadableStudy = createAction(LIST_UPLOADABLE_STUDY)
export const listUploadableStudySuccess = createAction(successAction(LIST_UPLOADABLE_STUDY))
export const listUploadableStudyFail = createAction(failAction(LIST_UPLOADABLE_STUDY))

export const listAllScanner = createAction(LIST_ALL_SCANNER)
export const listAllScannerSuccess = createAction(successAction(LIST_ALL_SCANNER))
export const listAllScannerFail = createAction(failAction(LIST_ALL_SCANNER))

export const listScanner = createAction(LIST_SCANNER)
export const listScannerSuccess = createAction(successAction(LIST_SCANNER))
export const listScannerFail = createAction(failAction(LIST_SCANNER))

export const getScanner = createAction(GET_SCANNER)
export const getScannerSuccess = createAction(successAction(GET_SCANNER))
export const getScannerFail = createAction(failAction(GET_SCANNER))

export const createScanner = createAction(CREATE_SCANNER)
export const createScannerSuccess = createAction(successAction(CREATE_SCANNER))
export const createScannerFail = createAction(failAction(CREATE_SCANNER))

export const updateScanner = createAction(UPDATE_SCANNER)
export const updateScannerSuccess = createAction(successAction(UPDATE_SCANNER))
export const updateScannerFail = createAction(failAction(UPDATE_SCANNER))

export const deleteScanner = createAction(DELETE_SCANNER)
export const deleteScannerSuccess = createAction(successAction(DELETE_SCANNER))
export const deleteScannerFail = createAction(failAction(DELETE_SCANNER))

export const listAllSubject = createAction(LIST_ALL_SUBJECT)
export const listAllSubjectSuccess = createAction(successAction(LIST_ALL_SUBJECT))
export const listAllSubjectFail = createAction(failAction(LIST_ALL_SUBJECT))

export const listSeries = createAction(LIST_SERIES)
export const listSeriesSuccess = createAction(successAction(LIST_SERIES))
export const listSeriesFail = createAction(failAction(LIST_SERIES))

export const createSubject = createAction(CREATE_SUBJECT)
export const createSubjectSuccess = createAction(successAction(CREATE_SUBJECT))
export const createSubjectFail = createAction(failAction(CREATE_SUBJECT))

export const listAllSession = createAction(LIST_ALL_SESSION)
export const listAllSessionSuccess = createAction(successAction(LIST_ALL_SESSION))
export const listAllSessionFail = createAction(failAction(LIST_ALL_SESSION))

export const listSession = createAction(LIST_SESSION)
export const listSessionSuccess = createAction(successAction(LIST_SESSION))
export const listSessionFail = createAction(failAction(LIST_SESSION))

export const createSession = createAction(CREATE_SESSION)
export const createSessionSuccess = createAction(successAction(CREATE_SESSION))
export const createSessionFail = createAction(failAction(CREATE_SESSION))

export const listAllSeries = createAction(LIST_ALL_SERIES)
export const listAllSeriesSuccess = createAction(successAction(LIST_ALL_SERIES))
export const listAllSeriesFail = createAction(failAction(LIST_ALL_SERIES))

export const createSeries = createAction(CREATE_SERIES)
export const createSeriesSuccess = createAction(successAction(CREATE_SERIES))
export const createSeriesFail = createAction(failAction(CREATE_SERIES))

export const getPreprocessingSummary = createAction(GET_PREPROCESSING_SUMMARY)
export const getPreprocessingSummarySuccess = createAction(successAction(GET_PREPROCESSING_SUMMARY))
export const getPreprocessingSummaryFail = createAction(failAction(GET_PREPROCESSING_SUMMARY))

export const listTag = createAction(LIST_TAG)
export const listTagSuccess = createAction(successAction(LIST_TAG))
export const listTagFail = createAction(failAction(LIST_TAG))

export const getTag = createAction(GET_TAG)
export const getTagSuccess = createAction(successAction(GET_TAG))
export const getTagFail = createAction(failAction(GET_TAG))

export const createTag = createAction(CREATE_TAG)
export const createTagSuccess = createAction(successAction(CREATE_TAG))
export const createTagFail = createAction(failAction(CREATE_TAG))

export const updateTag = createAction(UPDATE_TAG)
export const updateTagSuccess = createAction(successAction(UPDATE_TAG))
export const updateTagFail = createAction(failAction(UPDATE_TAG))

export const deleteTag = createAction(DELETE_TAG)
export const deleteTagSuccess = createAction(successAction(DELETE_TAG))
export const deleteTagFail = createAction(failAction(DELETE_TAG))

export const assignTags = createAction(ASSIGN_TAGS)
export const assignTagsSuccess = createAction(successAction(ASSIGN_TAGS))
export const assignTagsFail = createAction(failAction(ASSIGN_TAGS))
