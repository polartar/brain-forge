import { get } from 'lodash'

export const selectAuthState = state => get(state, 'auth')

export const selectLoggedInUser = state => get(state, 'auth.user')

export const selectLoggedIn = state => !!get(state, 'auth.user')

export const selectUsers = state => get(state, 'auth.users')

export const selectNewPassword = state => get(state, 'auth.newPassword')

export const selectIsSuperUser = state => get(state, 'auth.user.is_superuser')

export const selectIsStaff = state => get(state, 'auth.user.is_staff')

export const selectNotifications = state => get(state, 'auth.notifications')

export const selectMyInvites = state => get(state, 'auth.invites')

export const selectMySite = state => get(state, 'auth.site')

export const selectVersion = state => get(state, 'auth.version')

export const selectAuthStatus = state => get(state, 'auth.status')

export const selectAuthError = state => get(state, 'auth.error')
