import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import { REDIRECT_URL } from 'config/base'
import { selectLoggedIn, selectIsSuperUser } from 'store/modules/auth'
import { getItem } from 'utils/storage'

export const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/login',
  allowRedirectBack: false,
  authenticatedSelector: state => selectLoggedIn(state),
  wrapperDisplayName: 'UserIsAuthenticated',
})

export const userIsSuperAdmin = connectedRouterRedirect({
  redirectPath: '/not-found',
  allowRedirectBack: false,
  authenticatedSelector: state => selectIsSuperUser(state),
  wrapperDisplayName: 'UserIsSuperAdmin',
})

export const userIsNotSuperAdmin = connectedRouterRedirect({
  redirectPath: '/not-found',
  allowRedirectBack: false,
  authenticatedSelector: state => !selectIsSuperUser(state),
  wrapperDisplayName: 'UserIsNotSuperAdmin',
})

export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: () => {
    const redirectURL = getItem(REDIRECT_URL)
    return redirectURL || '/'
  },
  allowRedirectBack: false,
  authenticatedSelector: state => !selectLoggedIn(state),
  wrapperDisplayName: 'UserIsNotAuthenticated',
})
