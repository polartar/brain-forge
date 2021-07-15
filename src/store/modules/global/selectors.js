import { get } from 'lodash'

export const selectGlobalState = state => get(state, 'global')

export const selectIsSidebarPinned = state => get(state, 'global.isSidebarPinned')
