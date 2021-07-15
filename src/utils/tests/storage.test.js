import { AUTH_DATA } from 'config/base'
import { setItem, getItem, removeItem, setAuthData, getAuthData } from '../storage'

describe('Storage helpers', () => {
  it('setItem', () => {
    setItem('token', 'token')
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'token')
  })

  it('getItem', () => {
    getItem('token')
    expect(localStorage.getItem).toHaveBeenCalledWith('token')
  })

  it('removeItem', () => {
    removeItem('token')
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
  })

  it('getAuthData', () => {
    expect(getAuthData()).toBeNull()

    const data = { token: 'token' }
    setAuthData(data)

    expect(getAuthData()).toEqual(data)
  })

  it('setAuthData', () => {
    const data = { token: 'token' }
    setAuthData(data)

    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_DATA, JSON.stringify(data))
  })

  it('clearAuthData', () => {
    removeItem(AUTH_DATA)
    expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_DATA)
  })
})
