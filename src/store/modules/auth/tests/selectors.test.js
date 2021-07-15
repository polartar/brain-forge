import {
  selectAuthState,
  selectLoggedInUser,
  selectLoggedIn,
  selectUsers,
  selectNewPassword,
  selectIsSuperUser,
  selectNotifications,
  selectMyInvites,
  selectMySite,
  selectVersion,
  selectAuthStatus,
  selectAuthError,
} from '../selectors'

const state = {
  auth: {
    user: {
      first_name: 'john',
      last_name: 'doe',
      username: 'johndoe',
      email: 'johndoe@email.com',
      role: 'SuperAdmin',
      is_superuser: false,
    },
    users: [],
    notifications: [],
    site: null,
    invites: [],
    newPassword: null,
    status: 'INIT',
    version: null,
    error: null,
  },
}

describe('Auth selectors', () => {
  it('tests', () => {
    const { auth } = state

    expect(selectAuthState(state)).toEqual(auth)
    expect(selectLoggedInUser(state)).toEqual(auth.user)
    expect(selectLoggedIn(state)).toEqual(!!auth.user)
    expect(selectUsers(state)).toEqual(auth.users)
    expect(selectNewPassword(state)).toEqual(auth.newPassword)
    expect(selectIsSuperUser(state)).toEqual(auth.user.is_superuser)
    expect(selectNotifications(state)).toEqual(auth.notifications)
    expect(selectMyInvites(state)).toEqual(auth.invites)
    expect(selectMySite(state)).toEqual(auth.site)
    expect(selectVersion(state)).toEqual(auth.version)
    expect(selectAuthStatus(state)).toEqual(auth.status)
    expect(selectAuthError(state)).toEqual(auth.error)
  })
})
