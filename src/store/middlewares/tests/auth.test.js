import update from 'immutability-helper'
import { LOGOUT } from 'store/modules/auth'
import authMiddleware from '../auth'

const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
  }
  const next = jest.fn()

  const invoke = action => authMiddleware(store)(next)(action)

  return { store, next, invoke }
}

describe('Auth middeware', () => {
  it('should dispatch logout action', () => {
    const { store, next, invoke } = create()

    let action = { payload: { status: 401 } }
    invoke(action)
    expect(store.dispatch).toHaveBeenCalledWith({ type: LOGOUT })
    expect(next).toHaveBeenCalledTimes(1)

    action = update(action, { payload: { status: { $set: 403 } } })
    invoke(action)
    expect(store.dispatch).toHaveBeenCalledWith({ type: LOGOUT })
  })

  it('should not dispatch logout action', () => {
    const { store, next, invoke } = create()
    let action = { payload: { status: 200 } }
    invoke(action)
    expect(store.dispatch).not.toHaveBeenCalled()
    expect(next).toHaveBeenCalledTimes(1)

    action = {}
    invoke(action)
    expect(store.dispatch).not.toHaveBeenCalled()
  })
})
