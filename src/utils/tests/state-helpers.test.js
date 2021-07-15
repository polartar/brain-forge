import { successAction, failAction, isSuccessAction, isFailAction } from '../state-helpers'

describe('State helpers', () => {
  it('successAction', () => {
    const action = 'request'
    expect(successAction(action)).toBe('request/success')
  })

  it('failAction', () => {
    const action = 'request'
    expect(failAction(action)).toBe('request/fail')
  })

  it('isSuccessAction', () => {
    const action = 'request/success'
    expect(isSuccessAction(action)).toBeTruthy()
  })

  it('isFailAction', () => {
    const action = 'request/fail'
    expect(isFailAction(action)).toBeTruthy()
  })
})
