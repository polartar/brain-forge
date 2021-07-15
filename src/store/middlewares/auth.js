import { LOGOUT } from 'store/modules/auth'

const authMiddleware = store => next => action => {
  const { status } = action.payload || {}

  if (status === 401) {
    store.dispatch({
      type: LOGOUT,
    })
  }

  return next(action)
}

export default authMiddleware
