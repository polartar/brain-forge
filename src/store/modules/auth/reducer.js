import { handleActions, combineActions } from 'redux-actions'
import { find, get } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'
import { getAuthData, clearAuthData } from 'utils/storage'

import {
  LOGIN,
  LOGOUT,
  REGISTER,
  SEND_VERIFY_EMAIL,
  SEND_PASSWORD_RESET_EMAIL,
  EMAIL_VERIFY,
  GET_PROFILE,
  UPDATE_PROFILE,
  PASSWORD_RESET,
  LIST_NOTIFICATION,
  LIST_MY_INVITE,
  ACCEPT_MY_INVITE,
  REJECT_MY_INVITE,
  GET_MY_SITE,
  CREATE_MY_SITE,
  REMOVE_MEMBER_MY_SITE,
  SEND_INVITE_MY_SITE,
  DELETE_INVITE_MY_SITE,
  DELETE_MY_SITE,
  DELETE_NOTIFICATION,
  LEAVE_MY_SITE,
  LIST_USER,
  GET_VERSION,
} from './actions'

const initialState = {
  user: get(getAuthData(), 'user', null),
  users: [],
  notifications: [],
  site: null,
  invites: [],
  newPassword: null,
  status: 'INIT',
  error: null,
  version: null,
}

export const reducer = handleActions(
  {
    [combineActions(
      LOGIN,
      REGISTER,
      SEND_VERIFY_EMAIL,
      EMAIL_VERIFY,
      SEND_PASSWORD_RESET_EMAIL,
      GET_PROFILE,
      UPDATE_PROFILE,
      PASSWORD_RESET,
      LIST_NOTIFICATION,
      DELETE_NOTIFICATION,
      LIST_MY_INVITE,
      ACCEPT_MY_INVITE,
      REJECT_MY_INVITE,
      GET_MY_SITE,
      CREATE_MY_SITE,
      DELETE_MY_SITE,
      LEAVE_MY_SITE,
      REMOVE_MEMBER_MY_SITE,
      SEND_INVITE_MY_SITE,
      DELETE_INVITE_MY_SITE,
      LIST_USER,
      GET_VERSION,
    )]: (state, { type }) => ({ ...state, error: null, status: type }),

    [combineActions(successAction(LOGIN), successAction(REGISTER), successAction(EMAIL_VERIFY))]: (
      state,
      { payload, type },
    ) => ({ ...state, user: payload.user, status: type }),

    [combineActions(successAction(GET_PROFILE), successAction(UPDATE_PROFILE))]: (state, { payload, type }) => ({
      ...state,
      user: payload,
      status: type,
    }),

    [successAction(PASSWORD_RESET)]: (state, { payload, type }) => ({
      ...state,
      newPassword: payload,
      status: type,
    }),

    [successAction(LIST_NOTIFICATION)]: (state, { payload, type }) => ({
      ...state,
      notifications: payload,
      status: type,
    }),

    [successAction(DELETE_NOTIFICATION)]: (state, { payload, type }) => ({
      ...state,
      notifications: state.notifications.filter(notification => notification.id !== payload),
      status: type,
    }),

    [successAction(LIST_MY_INVITE)]: (state, { payload, type }) => ({
      ...state,
      invites: payload,
      status: type,
    }),

    [successAction(REMOVE_MEMBER_MY_SITE)]: (state, { payload, type }) => ({
      ...state,
      site: payload.isSiteOwner
        ? null
        : {
            ...state.site,
            members: state.site.members.filter(member => member.id !== payload.membershipId),
          },
      status: type,
    }),

    [successAction(SEND_INVITE_MY_SITE)]: (state, { payload, type }) => ({
      ...state,
      site: {
        ...state.site,
        invites: find(state.site.invites, { id: payload.invite.id })
          ? state.site.invites.map(invite =>
              invite.id === payload.invite.id ? { ...invite, ...payload.invite } : invite,
            )
          : [payload.invite, ...state.site.invites],
      },
      status: type,
    }),

    [successAction(DELETE_INVITE_MY_SITE)]: (state, { payload, type }) => ({
      ...state,
      site: {
        ...state.site,
        invites: state.site.invites.filter(invite => invite.id !== payload.inviteId),
      },
      notifications: state.notifications.filter(notification => notification.site !== payload.siteId),
      status: type,
    }),

    [successAction(LIST_USER)]: (state, { payload, type }) => ({
      ...state,
      users: payload,
      status: type,
    }),

    [combineActions(successAction(DELETE_MY_SITE), successAction(LEAVE_MY_SITE))]: (state, { type }) => ({
      ...state,
      site: null,
      status: type,
    }),

    [combineActions(successAction(ACCEPT_MY_INVITE), successAction(REJECT_MY_INVITE))]: (state, { payload, type }) => ({
      ...state,
      invites: state.invites.filter(invite => invite.id !== payload.inviteId),
      notifications: state.notifications.filter(notification => notification.site !== payload.siteId),
      status: type,
    }),

    [combineActions(successAction(GET_MY_SITE), successAction(CREATE_MY_SITE))]: (state, { payload, type }) => ({
      ...state,
      site: payload,
      status: type,
    }),

    [combineActions(successAction(SEND_VERIFY_EMAIL), successAction(SEND_PASSWORD_RESET_EMAIL))]: (
      state,
      { type },
    ) => ({ ...state, status: type }),

    [successAction(GET_VERSION)]: (state, { payload, type }) => ({
      ...state,
      version: payload,
      status: type,
    }),

    [combineActions(
      failAction(LOGIN),
      failAction(REGISTER),
      failAction(SEND_VERIFY_EMAIL),
      failAction(EMAIL_VERIFY),
      failAction(SEND_PASSWORD_RESET_EMAIL),
      failAction(GET_PROFILE),
      failAction(UPDATE_PROFILE),
      failAction(PASSWORD_RESET),
      failAction(LIST_NOTIFICATION),
      failAction(DELETE_NOTIFICATION),
      failAction(LIST_MY_INVITE),
      failAction(ACCEPT_MY_INVITE),
      failAction(REJECT_MY_INVITE),
      failAction(GET_MY_SITE),
      failAction(CREATE_MY_SITE),
      failAction(DELETE_MY_SITE),
      failAction(LEAVE_MY_SITE),
      failAction(REMOVE_MEMBER_MY_SITE),
      failAction(SEND_INVITE_MY_SITE),
      failAction(DELETE_INVITE_MY_SITE),
      failAction(LIST_USER),
      failAction(GET_VERSION),
    )]: (state, { payload, type }) => ({ ...state, error: payload.message, status: type }),

    [LOGOUT]: (state, { type }) => {
      clearAuthData()
      return { ...state, user: null, status: type }
    },
  },
  initialState,
)
