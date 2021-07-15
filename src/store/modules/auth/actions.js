import { createAction } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'

/**
 * Constants
 */
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const REGISTER = 'REGISTER'

export const SEND_VERIFY_EMAIL = 'SEND_VERIFY_EMAIL'
export const SEND_PASSWORD_RESET_EMAIL = 'SEND_PASSWORD_RESET_EMAIL'

export const EMAIL_VERIFY = 'EMAIL_VERIFY'

export const GET_PROFILE = 'GET_PROFILE'
export const UPDATE_PROFILE = 'UPDATE_PROFILE'

export const PASSWORD_RESET = 'PASSWORD_RESET'

export const LIST_NOTIFICATION = 'LIST_NOTIFICATION'
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION'

export const LIST_MY_INVITE = 'LIST_MTY_INVITE'
export const ACCEPT_MY_INVITE = 'ACCEPT_MY_INVTE'
export const REJECT_MY_INVITE = 'REJECT_MY_INVITE'

export const GET_MY_SITE = 'GET_MY_SITE'
export const CREATE_MY_SITE = 'CREATE_MY_SITE'
export const DELETE_MY_SITE = 'DELETE_MY_SITE'
export const LEAVE_MY_SITE = 'LEAVE_MY_SITE'
export const REMOVE_MEMBER_MY_SITE = 'REMOVE_MEMBER_MY_SITE'
export const SEND_INVITE_MY_SITE = 'SEND_INVITE_MY_SITE'
export const DELETE_INVITE_MY_SITE = 'DELETE_INVITE_MY_SITE'

export const LIST_USER = 'LIST_USER'

export const GET_VERSION = 'GET_VERSION'

/**
 * Action creators
 */
export const logIn = createAction(LOGIN)
export const logInSuccess = createAction(successAction(LOGIN))
export const logInFail = createAction(failAction(LOGIN))

export const logOut = createAction(LOGOUT)

export const register = createAction(REGISTER)
export const registerSuccess = createAction(successAction(REGISTER))
export const registerFail = createAction(failAction(REGISTER))

export const sendVerifyEmail = createAction(SEND_VERIFY_EMAIL)
export const sendVerifyEmailSuccess = createAction(successAction(SEND_VERIFY_EMAIL))
export const sendVerifyEmailFail = createAction(failAction(SEND_VERIFY_EMAIL))

export const sendPasswordResetEmail = createAction(SEND_PASSWORD_RESET_EMAIL)
export const sendPasswordResetEmailSuccess = createAction(successAction(SEND_PASSWORD_RESET_EMAIL))
export const sendPasswordResetEmailFail = createAction(failAction(SEND_PASSWORD_RESET_EMAIL))

export const emailVerify = createAction(EMAIL_VERIFY)
export const emailVerifySuccess = createAction(successAction(EMAIL_VERIFY))
export const emailVerifyFail = createAction(failAction(EMAIL_VERIFY))

export const getProfile = createAction(GET_PROFILE)
export const getProfileSuccess = createAction(successAction(GET_PROFILE))
export const getProfileFail = createAction(failAction(GET_PROFILE))

export const updateProfile = createAction(UPDATE_PROFILE)
export const updateProfileSuccess = createAction(successAction(UPDATE_PROFILE))
export const updateProfileFail = createAction(failAction(UPDATE_PROFILE))

export const passwordReset = createAction(PASSWORD_RESET)
export const passwordResetSuccess = createAction(successAction(PASSWORD_RESET))
export const passwordResetFail = createAction(failAction(PASSWORD_RESET))

export const listNotification = createAction(LIST_NOTIFICATION)
export const listNotificationSuccess = createAction(successAction(LIST_NOTIFICATION))
export const listNotificationFail = createAction(failAction(LIST_NOTIFICATION))

export const deleteNotification = createAction(DELETE_NOTIFICATION)
export const deleteNotificationSuccess = createAction(successAction(DELETE_NOTIFICATION))
export const deleteNotificationFail = createAction(failAction(DELETE_NOTIFICATION))

export const listMyInvite = createAction(LIST_MY_INVITE)
export const listMyInviteSuccess = createAction(successAction(LIST_MY_INVITE))
export const listMyInviteFail = createAction(failAction(LIST_MY_INVITE))

export const acceptMyInvite = createAction(ACCEPT_MY_INVITE)
export const acceptMyInviteSuccess = createAction(successAction(ACCEPT_MY_INVITE))
export const acceptMyInviteFail = createAction(failAction(ACCEPT_MY_INVITE))

export const rejectMyInvite = createAction(REJECT_MY_INVITE)
export const rejectMyInviteSuccess = createAction(successAction(REJECT_MY_INVITE))
export const rejectMyInviteFail = createAction(failAction(REJECT_MY_INVITE))

export const getMySite = createAction(GET_MY_SITE)
export const getMySiteSuccess = createAction(successAction(GET_MY_SITE))
export const getMySiteFail = createAction(successAction(GET_MY_SITE))

export const createMySite = createAction(CREATE_MY_SITE)
export const createMySiteSuccess = createAction(successAction(CREATE_MY_SITE))
export const createMySiteFail = createAction(failAction(CREATE_MY_SITE))

export const deleteMySite = createAction(DELETE_MY_SITE)
export const deleteMySiteSuccess = createAction(successAction(DELETE_MY_SITE))
export const deleteMySiteFail = createAction(failAction(DELETE_MY_SITE))

export const leaveMySite = createAction(LEAVE_MY_SITE)
export const leaveMySiteSuccess = createAction(successAction(LEAVE_MY_SITE))
export const leaveMySiteFail = createAction(failAction(LEAVE_MY_SITE))

export const removeMemberMySite = createAction(REMOVE_MEMBER_MY_SITE)
export const removeMemberMySiteSuccess = createAction(successAction(REMOVE_MEMBER_MY_SITE))
export const removeMemberMySiteFail = createAction(failAction(REMOVE_MEMBER_MY_SITE))

export const sendInviteMySite = createAction(SEND_INVITE_MY_SITE)
export const sendInviteMySiteSuccess = createAction(successAction(SEND_INVITE_MY_SITE))
export const sendInviteMySiteFail = createAction(failAction(SEND_INVITE_MY_SITE))

export const deleteInviteMySite = createAction(DELETE_INVITE_MY_SITE)
export const deleteInviteMySiteSuccess = createAction(successAction(DELETE_INVITE_MY_SITE))
export const deleteInviteMySiteFail = createAction(failAction(DELETE_INVITE_MY_SITE))

export const listUser = createAction(LIST_USER)
export const listUserSuccess = createAction(successAction(LIST_USER))
export const listUserFail = createAction(failAction(LIST_USER))

export const getVersion = createAction(GET_VERSION)
export const getVersionSuccess = createAction(successAction(GET_VERSION))
export const getVersionFail = createAction(failAction(GET_VERSION))
