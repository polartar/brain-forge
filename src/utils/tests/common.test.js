import { SitesMock, UsersMock } from 'test/mocks'
import * as commonUtils from '../common'

describe('Common utils', () => {
  it('swalCreator', () => {
    commonUtils.swalCreator(true, 'success title', 'success text', 'error title', 'error text')
    commonUtils.swalCreator(false, 'success title', 'success text', 'error title', 'error text')
  })

  it('toBase64Image', () => {
    const string = 'abc'
    expect(commonUtils.toBase64Image(string)).not.toBe(string)
  })

  it('getFilename', () => {
    const string = '1.txt'
    expect(commonUtils.getFilename(string)).toBe(string)
  })

  it('openToastr', () => {
    commonUtils.openToastr('error', 'Invalid', {})
  })

  it('showErrorToast', () => {
    commonUtils.showErrorToast('error', {})
    commonUtils.showErrorToast('error')
  })

  it('getEditableSites', () => {
    const sites = SitesMock(3)
    const user = { id: 1, name: 'user 1', is_superuser: false, site: 5 }

    expect(commonUtils.getEditableSites(sites, user).length).toBe(0)
    expect(commonUtils.getEditableSites(sites, { ...user, is_superuser: true }).length).toBe(sites.length)
    expect(commonUtils.getEditableSites(sites, { ...user, site: null }).length).toBe(0)
  })

  it('isSharedData', () => {
    const users = UsersMock(3)
    let user = { id: 1, name: 'user 1' }
    expect(commonUtils.isSharedData(users, user)).toBeTruthy()

    user = { id: 5, name: 'user 5' }
    expect(commonUtils.isSharedData(users, user)).toBeFalsy()
  })

  it('getFullname', () => {
    const user = { first_name: 'Julia', last_name: 'Stephen' }

    expect(commonUtils.getFullname(user)).toBe('Julia Stephen')
  })

  it('getParameterLayouts', () => {
    const fullWidthLayouts = commonUtils.getParameterLayouts(true)

    expect(fullWidthLayouts.formLayout.labelCol.sm.span).toBe(4)
    expect(fullWidthLayouts.gridLayout.lg).toBeUndefined()
  })

  it('arrayMove', () => {
    const arr = [1, 2, 3]
    expect(commonUtils.arrayMove(arr, 1, 2)).toEqual([1, 3, 2])
  })
})
