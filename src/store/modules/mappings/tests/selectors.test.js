import {
  selectMappingsState,
  selectProtocols,
  selectProtocolMappings,
  selectModalities,
  selectModalitiesStatus,
  selectModalitiesError,
} from '../selectors'

const state = {
  mappings: {
    protocols: [],
    protocolMappings: [],
    modalities: [],
    status: 'INIT',
    error: null,
  },
}

describe('Mappings selectors', () => {
  it('tests', () => {
    const { mappings } = state

    expect(selectMappingsState(state)).toEqual(mappings)
    expect(selectProtocols(state)).toEqual(mappings.protocols)
    expect(selectProtocolMappings(state)).toEqual(mappings.protocolMappings)
    expect(selectModalities(state)).toEqual(mappings.modalities)
    expect(selectModalitiesStatus(state)).toEqual(mappings.status)
    expect(selectModalitiesError(state)).toEqual(mappings.error)
  })
})
