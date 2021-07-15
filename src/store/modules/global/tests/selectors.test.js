import { selectGlobalState, selectIsSidebarPinned } from '../selectors'

const state = {
  global: {
    isSidebarPinned: false,
    status: 'INIT',
    error: null,
  },
}

describe('DataFile selectors', () => {
  it('tests', () => {
    const { global } = state

    expect(selectGlobalState(state)).toEqual(global)
    expect(selectIsSidebarPinned(state)).toEqual(global.isSidebarPinned)
  })
})
