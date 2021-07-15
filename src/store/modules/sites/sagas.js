import axios from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import { parseError } from 'utils/error-parser'
import { showErrorToast } from 'utils/common'
import * as actions from './actions'

export const doListSite = function*() {
  try {
    const res = yield call(axios.get, `/site/`)
    yield put(actions.listSiteSuccess(res.data))
  } catch (error) {
    yield put(actions.listSiteFail(parseError(error)))
  }
}

export const doCreateSite = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/site/`, payload)
    yield put(actions.createSiteSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.createSiteFail(err))
  }
}

export const doGetSite = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/site/${payload}/`)
    yield put(actions.getSiteSuccess(res.data))
  } catch (error) {
    yield put(actions.getSiteFail(parseError(error)))
  }
}

export const doDeleteSite = function*({ payload }) {
  try {
    yield call(axios.delete, `/site/${payload}/`)
    yield put(actions.deleteSiteSuccess(payload))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.deleteSiteFail(err))
  }
}

export const doSendInvite = function*({ payload }) {
  const { siteId, data } = payload

  try {
    const res = yield call(axios.post, `/site/${siteId}/invite/`, data)
    yield put(actions.sendInviteSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.sendInviteFail(err))
  }
}

export const doDeleteInvite = function*({ payload }) {
  const { siteId, inviteId } = payload

  try {
    yield call(axios.delete, `/site/${siteId}/invite/${inviteId}/`)
    yield put(actions.deleteInviteSuccess(inviteId))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.deleteInviteFail(err))
  }
}

export const doSetAdmin = function*({ payload }) {
  const { siteId, userId } = payload
  const data = { user: userId }

  try {
    yield call(axios.patch, `/site/${siteId}/admin/`, data)
    yield put(actions.setAdminSuccess(userId))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.setAdminFail(err))
  }
}

export const doRemoveMember = function*({ payload }) {
  const { siteId, membershipId } = payload

  try {
    yield call(axios.delete, `/site/${siteId}/member/${membershipId}/`)
    yield put(actions.removeMemberSuccess(membershipId))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.removeMemberFail(err))
  }
}

export const doListStudy = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/study/`, payload)
    yield put(actions.listStudySuccess(res.data))
  } catch (error) {
    yield put(actions.listStudyFail(parseError(error)))
  }
}

export const doCreateStudy = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/study/`, payload)
    yield put(actions.createStudySuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.createStudyFail(err))
  }
}

export const doGetStudy = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/study/${payload}/`)
    yield put(actions.getStudySuccess(res.data))
  } catch (error) {
    yield put(actions.getStudyFail(parseError(error)))
  }
}

export const doUpdateStudy = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/study/${id}/`, data)
    yield put(actions.updateStudySuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.updateStudyFail(err))
  }
}

export const doDeleteStudy = function*({ payload }) {
  try {
    yield call(axios.delete, `/study/${payload}/`)
    yield put(actions.deleteStudySuccess(payload))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.deleteStudyFail(err))
  }
}

export const doListUploadableStudy = function*() {
  try {
    const res = yield call(axios.get, `/study/uploadable/`)
    yield put(actions.listUploadableStudySuccess(res.data))
  } catch (error) {
    yield put(actions.listUploadableStudyFail(parseError(error)))
  }
}

export const doListAllScanner = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/scanner/all/`, payload)
    yield put(actions.listAllScannerSuccess(res.data))
  } catch (error) {
    yield put(actions.listAllScannerFail(parseError(error)))
  }
}

export const doListScanner = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/scanner/`, payload)
    yield put(actions.listScannerSuccess(res.data))
  } catch (error) {
    yield put(actions.listScannerFail(parseError(error)))
  }
}

export const doCreateScanner = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/scanner/`, payload)
    yield put(actions.createScannerSuccess(res.data))
  } catch (error) {
    yield put(actions.createScannerFail(parseError(error)))
  }
}

export const doGetScanner = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/scanner/${payload}/`)
    yield put(actions.getScannerSuccess(res.data))
  } catch (error) {
    yield put(actions.getScannerFail(parseError(error)))
  }
}

export const doUpdateScanner = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/scanner/${id}/`, data)
    yield put(actions.updateScannerSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.updateScannerFail(err))
  }
}

export const doDeleteScanner = function*({ payload }) {
  try {
    yield call(axios.delete, `/scanner/${payload}/`)
    yield put(actions.deleteScannerSuccess(payload))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.deleteScannerFail(err))
  }
}

export const doListAllSubject = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/subject/all/`, payload)
    yield put(actions.listAllSubjectSuccess(res.data))
  } catch (error) {
    yield put(actions.listAllSubjectFail(parseError(error)))
  }
}

export const doCreateSubject = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/subject/`, payload)
    yield put(actions.createSubjectSuccess(res.data))
  } catch (error) {
    yield put(actions.createSubjectFail(parseError(error)))
  }
}

export const doListAllSession = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/session/all/`, payload)
    yield put(actions.listAllSessionSuccess(res.data))
  } catch (error) {
    yield put(actions.listAllSessionFail(parseError(error)))
  }
}

export const doListSession = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/session/`, payload)
    yield put(actions.listSessionSuccess(res.data))
  } catch (error) {
    yield put(actions.listSessionFail(parseError(error)))
  }
}

export const doCreateSession = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/session/`, payload)
    yield put(actions.createSessionSuccess(res.data))
  } catch (error) {
    yield put(actions.createSessionFail(parseError(error)))
  }
}

export const doListAllSeries = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/series/all/`, payload)
    yield put(actions.listAllSeriesSuccess(res.data))
  } catch (error) {
    yield put(actions.listAllSeriesFail(parseError(error)))
  }
}

export const doListSeries = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/series/`, payload)
    yield put(actions.listSeriesSuccess(res.data))
  } catch (error) {
    yield put(actions.listSeriesFail(parseError(error)))
  }
}

export const doCreateSeries = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/series/`, payload)
    yield put(actions.createSeriesSuccess(res.data))
  } catch (error) {
    yield put(actions.createSeriesFail(parseError(error)))
  }
}

export const doListTag = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/tag/`, payload)
    yield put(actions.listTagSuccess(res.data))
  } catch (error) {
    yield put(actions.listTagFail(parseError(error)))
  }
}

export const doGetTag = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/tag/${payload}/`)
    yield put(actions.getTagSuccess(res.data))
  } catch (error) {
    yield put(actions.getTagFail(parseError(error)))
  }
}

export const doCreateTag = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/tag/`, payload)
    yield put(actions.createTagSuccess(res.data))
  } catch (error) {
    yield put(actions.createTagFail(parseError(error)))
  }
}

export const doUpdateTag = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/tag/${id}/`, data)
    yield put(actions.updateTagSuccess(res.data))
  } catch (error) {
    yield put(actions.updateTagFail(parseError(error)))
  }
}

export const doDeleteTag = function*({ payload }) {
  try {
    yield call(axios.delete, `/tag/${payload}/`)
    yield put(actions.deleteTagSuccess(payload))
  } catch (error) {
    yield put(actions.deleteTagFail(parseError(error)))
  }
}

export const doAssignTags = function*({ payload }) {
  try {
    const res = yield call(axios.post, '/tag-assign/', payload)
    yield put(actions.assignTagsSuccess(res.data))
  } catch (error) {
    yield put(actions.assignTagsFail(parseError(error)))
  }
}

export const saga = function*() {
  yield takeEvery(actions.LIST_SITE, doListSite)
  yield takeEvery(actions.CREATE_SITE, doCreateSite)
  yield takeEvery(actions.GET_SITE, doGetSite)
  yield takeEvery(actions.DELETE_SITE, doDeleteSite)

  yield takeEvery(actions.SEND_INVITE, doSendInvite)
  yield takeEvery(actions.DELETE_INVITE, doDeleteInvite)

  yield takeEvery(actions.SET_ADMIN, doSetAdmin)
  yield takeEvery(actions.REMOVE_MEMBER, doRemoveMember)

  yield takeEvery(actions.LIST_STUDY, doListStudy)
  yield takeEvery(actions.CREATE_STUDY, doCreateStudy)
  yield takeEvery(actions.GET_STUDY, doGetStudy)
  yield takeEvery(actions.UPDATE_STUDY, doUpdateStudy)
  yield takeEvery(actions.DELETE_STUDY, doDeleteStudy)
  yield takeEvery(actions.LIST_UPLOADABLE_STUDY, doListUploadableStudy)

  yield takeEvery(actions.LIST_ALL_SCANNER, doListAllScanner)
  yield takeEvery(actions.LIST_SCANNER, doListScanner)
  yield takeEvery(actions.CREATE_SCANNER, doCreateScanner)
  yield takeEvery(actions.GET_SCANNER, doGetScanner)
  yield takeEvery(actions.UPDATE_SCANNER, doUpdateScanner)
  yield takeEvery(actions.DELETE_SCANNER, doDeleteScanner)

  yield takeEvery(actions.LIST_ALL_SUBJECT, doListAllSubject)
  yield takeEvery(actions.CREATE_SUBJECT, doCreateSubject)

  yield takeEvery(actions.LIST_ALL_SESSION, doListAllSession)
  yield takeEvery(actions.LIST_SESSION, doListSession)
  yield takeEvery(actions.CREATE_SESSION, doCreateSession)

  yield takeEvery(actions.LIST_ALL_SERIES, doListAllSeries)
  yield takeEvery(actions.LIST_SERIES, doListSeries)
  yield takeEvery(actions.CREATE_SERIES, doCreateSeries)

  yield takeEvery(actions.LIST_TAG, doListTag)
  yield takeEvery(actions.GET_TAG, doGetTag)
  yield takeEvery(actions.CREATE_TAG, doCreateTag)
  yield takeEvery(actions.UPDATE_TAG, doUpdateTag)
  yield takeEvery(actions.DELETE_TAG, doDeleteTag)
  yield takeEvery(actions.ASSIGN_TAGS, doAssignTags)
}
