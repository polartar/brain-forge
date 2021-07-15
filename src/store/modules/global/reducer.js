import { handleActions } from 'redux-actions'
import { SIDEBAR_PINNED } from 'config/base'
import { getItem, setItem } from 'utils/storage'
import { TOGGLE_SIDEBAR_PIN } from './actions'

/* Initial State */

const initialState = {
  isSidebarPinned: getItem(SIDEBAR_PINNED) === 'true',
  status: 'INIT',
  error: null,
}

export const reducer = handleActions(
  {
    [TOGGLE_SIDEBAR_PIN]: (state, { type }) => {
      setItem(SIDEBAR_PINNED, !state.isSidebarPinned)

      return {
        ...state,
        isSidebarPinned: !state.isSidebarPinned,
        status: type,
      }
    },
  },
  initialState,
)
