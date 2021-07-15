import axios from 'axios'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { selectLoggedInUser } from 'store/modules/auth'
import { setAuthData, getAuthData } from 'utils/storage'
import { showErrorToast } from 'utils/common'
import { parseError } from 'utils/error-parser'
import * as actions from './actions'

export const doLogIn = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/auth/login/`, payload)
    setAuthData(res.data)
    yield put(actions.logInSuccess(res.data))
  } catch (error) {
    yield put(actions.logInFail(parseError(error)))
  }
}

export const doRegister = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/auth/register/`, payload)
    setAuthData(res.data)
    yield put(actions.registerSuccess(res.data))
  } catch (error) {
    yield put(actions.registerFail(parseError(error)))
  }
}

export const doSendVerifyEmail = function*() {
  try {
    yield call(axios.get, `/auth/email-verify/`)
    yield put(actions.sendVerifyEmailSuccess())
  } catch (error) {
    yield put(actions.sendVerifyEmailFail(parseError(error)))
  }
}

export const doEmailVerify = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/auth/email-verify/`, payload)
    setAuthData(res.data)
    yield put(actions.emailVerifySuccess(res.data))
  } catch (error) {
    yield put(actions.emailVerifyFail(parseError(error)))
  }
}

export const doSendPasswordResetEmail = function*({ payload }) {
  try {
    yield call(axios.post, `/auth/password-reset/`, payload)
    yield put(actions.sendPasswordResetEmailSuccess())
  } catch (error) {
    yield put(actions.sendPasswordResetEmailFail(parseError(error)))
  }
}

export const doPasswordReset = function*({ payload }) {
  try {
    const res = yield call(axios.put, `/auth/password-reset/`, payload)
    yield put(actions.passwordResetSuccess(res.data.new_password))
  } catch (error) {
    yield put(actions.passwordResetFail(parseError(error)))
  }
}

export const doGetProfile = function*() {
  try {
    const res = yield call(axios.get, `/auth/profile/`)

    let auth = getAuthData()
    auth.user = res.data
    setAuthData(auth)

    yield put(actions.getProfileSuccess(res.data))
  } catch (error) {
    yield put(actions.getProfileFail(parseError(error)))
  }
}

export const doUpdateProfile = function*({ payload }) {
  try {
    const res = yield call(axios.patch, `/auth/profile/`, payload)

    let auth = getAuthData()
    auth.user = res.data
    setAuthData(auth)

    yield put(actions.updateProfileSuccess(res.data))
  } catch (error) {
    yield put(actions.updateProfileFail(parseError(error)))
  }
}

export const doListNotification = function*() {
  try {
    const res = yield call(axios.get, `/auth/notification/`)
    yield put(actions.listNotificationSuccess(res.data))
  } catch (error) {
    yield put(actions.listNotificationFail(parseError(error)))
  }
}

export const doDeleteNotification = function*({ payload }) {
  try {
    yield call(axios.delete, `/auth/notification/${payload}/`)
    yield put(actions.deleteNotificationSuccess(payload))
  } catch (error) {
    yield put(actions.deleteNotificationFail(parseError(error)))
  }
}

export const doListMyInvite = function*() {
  try {
    const res = yield call(axios.get, `/auth/invite/`)
    yield put(actions.listMyInviteSuccess(res.data))
  } catch (error) {
    yield put(actions.listMyInviteFail(parseError(error)))
  }
}

export const doAcceptMyInvite = function*({ payload }) {
  const { inviteId } = payload

  try {
    yield call(axios.patch, `/auth/invite/${inviteId}/`)
    yield put(actions.acceptMyInviteSuccess(payload))
  } catch (error) {
    yield put(actions.acceptMyInviteFail(parseError(error)))
  }
}

export const doRejectMyInvite = function*({ payload }) {
  const { inviteId } = payload

  try {
    yield call(axios.delete, `/auth/invite/${inviteId}/`)
    yield put(actions.rejectMyInviteSuccess(payload))
  } catch (error) {
    yield put(actions.rejectMyInviteFail(parseError(error)))
  }
}

export const doGetMySite = function*() {
  try {
    const res = yield call(axios.get, `/auth/site/`)
    yield put(actions.getMySiteSuccess(res.data === '' ? null : res.data))
  } catch (error) {
    yield put(actions.getMySiteFail(parseError(error)))
  }
}

export const doCreateMySite = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/auth/site/`, payload)
    yield put(actions.createMySiteSuccess(res.data))
    yield put(actions.getProfile())
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.createMySiteFail(err))
  }
}

export const doDeleteMySite = function*() {
  try {
    yield call(axios.delete, `/auth/site/`)
    yield put(actions.deleteMySiteSuccess())
    yield put(actions.getProfile())
  } catch (error) {
    yield put(actions.deleteMySiteFail(parseError(error)))
  }
}

export const doLeaveMySite = function*() {
  try {
    yield call(axios.delete, `/auth/site/leave/`)
    yield put(actions.leaveMySiteSuccess())
    yield put(actions.getProfile())
  } catch (error) {
    yield put(actions.leaveMySiteFail(parseError(error)))
  }
}

export const doSendInviteMySite = function*({ payload }) {
  const { siteId, data } = payload

  try {
    const res = yield call(axios.post, `/site/${siteId}/invite/`, data)
    yield put(actions.sendInviteMySiteSuccess({ siteId, invite: res.data }))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.sendInviteMySiteFail(parseError(error)))
  }
}

export const doDeleteInviteMySite = function*({ payload }) {
  const { siteId, inviteId } = payload

  try {
    yield call(axios.delete, `/site/${siteId}/invite/${inviteId}/`)
    yield put(actions.deleteInviteMySiteSuccess(payload))
  } catch (error) {
    yield put(actions.deleteInviteMySiteFail(parseError(error)))
  }
}

export const doRemoveMemberMySite = function*({ payload }) {
  const { siteId, membershipId } = payload
  const loggedInUser = yield select(selectLoggedInUser)

  try {
    yield call(axios.delete, `/site/${siteId}/member/${membershipId}/`)
    yield put(actions.removeMemberMySiteSuccess({ ...payload, isSiteOwner: loggedInUser.site === payload.siteId }))
  } catch (error) {
    yield put(actions.removeMemberMySiteFail(parseError(error)))
  }
}

export const doListUser = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/auth/user/`, payload)
    yield put(actions.listUserSuccess(res.data))
  } catch (error) {
    yield put(actions.listUserFail(parseError(error)))
  }
}

export const doGetVersion = function*() {
  try {
    const res = yield call(axios.get, `/auth/version/`)
    yield put(actions.getVersionSuccess(res.data))
  } catch (error) {
    yield put(actions.getVersionFail(parseError(error)))
  }
}

export const saga = function*() {
  yield takeEvery(actions.LOGIN, doLogIn)
  yield takeEvery(actions.REGISTER, doRegister)

  yield takeEvery(actions.SEND_VERIFY_EMAIL, doSendVerifyEmail)
  yield takeEvery(actions.EMAIL_VERIFY, doEmailVerify)

  yield takeEvery(actions.SEND_PASSWORD_RESET_EMAIL, doSendPasswordResetEmail)
  yield takeEvery(actions.PASSWORD_RESET, doPasswordReset)

  yield takeEvery(actions.GET_PROFILE, doGetProfile)
  yield takeEvery(actions.UPDATE_PROFILE, doUpdateProfile)

  yield takeEvery(actions.LIST_NOTIFICATION, doListNotification)
  yield takeEvery(actions.DELETE_NOTIFICATION, doDeleteNotification)

  yield takeEvery(actions.LIST_MY_INVITE, doListMyInvite)
  yield takeEvery(actions.ACCEPT_MY_INVITE, doAcceptMyInvite)
  yield takeEvery(actions.REJECT_MY_INVITE, doRejectMyInvite)

  yield takeEvery(actions.GET_MY_SITE, doGetMySite)
  yield takeEvery(actions.CREATE_MY_SITE, doCreateMySite)
  yield takeEvery(actions.DELETE_MY_SITE, doDeleteMySite)
  yield takeEvery(actions.LEAVE_MY_SITE, doLeaveMySite)
  yield takeEvery(actions.REMOVE_MEMBER_MY_SITE, doRemoveMemberMySite)

  yield takeEvery(actions.SEND_INVITE_MY_SITE, doSendInviteMySite)
  yield takeEvery(actions.DELETE_INVITE_MY_SITE, doDeleteInviteMySite)

  yield takeEvery(actions.LIST_USER, doListUser)

  yield takeEvery(actions.GET_VERSION, doGetVersion)
}
