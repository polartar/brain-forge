import { find, pick } from 'lodash'
import { successAction, failAction } from 'utils/state-helpers'
import { UserMock, UsersMock, SiteMock, NotificationsMock, InvitesMock, InviteMock } from 'test/mocks'
import {
  LOGIN,
  LOGOUT,
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
} from '../actions'
import { reducer } from '../reducer'

const initialState = {
  user: null,
  users: UsersMock(),
  notifications: NotificationsMock(3),
  site: SiteMock(),
  invites: InvitesMock(3),
  newPassword: null,
  status: 'INIT',
  error: null,
  version: null,
}

describe('AuthReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should return fetching state', () => {
    const actionTypes = [
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
    ]

    actionTypes.forEach(type => {
      const nextState = reducer(initialState, { type })
      expect(pick(nextState, ['error', 'status'])).toEqual({ error: null, status: type })
    })
  })

  it('should return success state', () => {
    let actionNames = [LOGIN, REGISTER, EMAIL_VERIFY]

    actionNames.forEach(actionName => {
      const action = { type: successAction(actionName), payload: { User: UserMock() } }
      const nextState = reducer(initialState, action)
      expect(pick(nextState, ['user', 'status'])).toEqual({
        user: action.payload.user,
        status: action.type,
      })
    })

    actionNames = [GET_PROFILE, UPDATE_PROFILE]

    actionNames.forEach(actionName => {
      const action = { type: successAction(actionName), payload: { User: UserMock() } }
      const nextState = reducer(initialState, action)
      expect(pick(nextState, ['user', 'status'])).toEqual({
        user: action.payload,
        status: action.type,
      })
    })

    let action = { type: successAction(PASSWORD_RESET), payload: 'password' }
    let nextState = reducer(initialState, action)
    expect(pick(nextState, ['newPassword', 'status'])).toEqual({
      newPassword: action.payload,
      status: action.type,
    })

    action = { type: successAction(LIST_NOTIFICATION), payload: NotificationsMock(2) }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['notifications', 'status'])).toEqual({
      notifications: action.payload,
      status: action.type,
    })

    action = { type: successAction(DELETE_NOTIFICATION), payload: 1 }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['notifications', 'status'])).toEqual({
      notifications: initialState.notifications.filter(notification => notification.id !== action.payload),
      status: action.type,
    })

    action = { type: successAction(LIST_MY_INVITE), payload: [] }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['invites', 'status'])).toEqual({
      invites: action.payload,
      status: action.type,
    })

    action = { type: successAction(REMOVE_MEMBER_MY_SITE), payload: { isSiteOwner: false, userId: 2, membershipId: 1 } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        members: initialState.site.members.filter(member => member.id !== action.payload.membershipId),
      },
      status: action.type,
    })

    action = { type: successAction(REMOVE_MEMBER_MY_SITE), payload: { isSiteOwner: true, userId: 1, membershipId: 1 } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: null,
      status: action.type,
    })

    action = { type: successAction(SEND_INVITE_MY_SITE), payload: { siteId: 1, invite: InviteMock(1) } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        invites: find(initialState.site.invites, { id: action.payload.invite.id })
          ? initialState.site.invites.map(invite =>
              invite.id === action.payload.invite.id ? { ...invite, ...action.payload.invite } : invite,
            )
          : [action.payload.invite, ...initialState.site.invites],
      },
      status: action.type,
    })

    action = { type: successAction(SEND_INVITE_MY_SITE), payload: { siteId: 1, invite: InviteMock(6) } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'status'])).toEqual({
      site: {
        ...initialState.site,
        invites: find(initialState.site.invites, { id: action.payload.invite.id })
          ? initialState.site.invites.map(invite =>
              invite.id === action.payload.invite.id ? { ...invite, ...action.payload.invite } : invite,
            )
          : [action.payload.invite, ...initialState.site.invites],
      },
      status: action.type,
    })

    action = { type: successAction(DELETE_INVITE_MY_SITE), payload: { siteId: 1, inviteId: 1 } }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['site', 'notifications', 'status'])).toEqual({
      site: {
        ...initialState.site,
        invites: initialState.site.invites.filter(invite => invite.id !== action.payload.inviteId),
      },
      notifications: initialState.notifications.filter(notification => notification.site !== action.payload.siteId),
      status: action.type,
    })

    action = { type: successAction(LIST_USER), payload: [] }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['users', 'status'])).toEqual({
      users: action.payload,
      status: action.type,
    })

    actionNames = [DELETE_MY_SITE, LEAVE_MY_SITE]
    actionNames.forEach(actionName => {
      const action = { type: successAction(actionName) }
      const nextState = reducer(initialState, action)
      expect(pick(nextState, ['site', 'status'])).toEqual({
        site: null,
        status: action.type,
      })
    })

    actionNames = [ACCEPT_MY_INVITE, REJECT_MY_INVITE]
    actionNames.forEach(actionName => {
      const action = { type: successAction(actionName), payload: { siteId: 1, inviteId: 1 } }
      const nextState = reducer(initialState, action)
      expect(pick(nextState, ['invites', 'notifications', 'status'])).toEqual({
        invites: initialState.invites.filter(invite => invite.id !== action.payload.inviteId),
        notifications: initialState.notifications.filter(notification => notification.site !== action.payload.siteId),
        status: action.type,
      })
    })

    actionNames = [GET_MY_SITE, CREATE_MY_SITE]
    actionNames.forEach(actionName => {
      const action = { type: successAction(actionName), payload: SiteMock(1) }
      const nextState = reducer(initialState, action)
      expect(pick(nextState, ['site', 'status'])).toEqual({
        site: action.payload,
        status: action.type,
      })
    })

    actionNames = [SEND_VERIFY_EMAIL, SEND_PASSWORD_RESET_EMAIL]
    actionNames.forEach(actionName => {
      const action = { type: successAction(actionName), payload: SiteMock(1) }
      const nextState = reducer(initialState, action)
      expect(pick(nextState, ['status'])).toEqual({
        status: action.type,
      })
    })

    action = { type: successAction(GET_VERSION), payload: '1.0.0' }
    nextState = reducer(initialState, action)
    expect(pick(nextState, ['version', 'status'])).toEqual({
      version: action.payload,
      status: action.type,
    })
  })

  it('should return fail state', () => {
    const actionTypes = [
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
    ]

    actionTypes.forEach(type => {
      const action = { type: failAction(type), payload: { message: type } }
      const nextState = reducer(initialState, action)

      expect(pick(nextState, ['error', 'status'])).toEqual({ error: action.payload.message, status: action.type })
    })
  })

  it('should logout the user', () => {
    const action = { type: LOGOUT }
    const nextState = reducer(initialState, action)
    expect(pick(nextState, ['user', 'status'])).toEqual({
      user: null,
      status: action.type,
    })
  })
})
