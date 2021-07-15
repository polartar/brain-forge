import { pick } from 'lodash'
import { TOGGLE_SIDEBAR_PIN } from '../actions'
import { reducer } from '../reducer'

const initialState = {
  isSidebarPinned: false,
  status: 'INIT',
  error: null,
}

describe('GlobalReducer', () => {
  it('should return the initial state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should toggle sidebar pin', () => {
    const action = { type: TOGGLE_SIDEBAR_PIN }
    const nextState = reducer(initialState, action)

    expect(pick(nextState, ['isSidebarPinned', 'status'])).toEqual({
      isSidebarPinned: !initialState.isSidebarPinned,
      status: action.type,
    })
  })
})
