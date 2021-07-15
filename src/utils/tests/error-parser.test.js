import update from 'immutability-helper'
import { ErrorMock } from 'test/mocks'
import { parseError, getParameterSetErrorMessage } from '../error-parser'

describe('Error parser', () => {
  it('parseError', () => {
    let error = ErrorMock()
    let errorRes = { message: error.response.data[0], status: error.response.status }

    expect(parseError(error)).toEqual(errorRes)

    error = update(ErrorMock(), { response: { data: { $set: null } } })
    errorRes = { message: 'There was an unexpected error', status: error.response.status }
    expect(parseError(error)).toEqual(errorRes)

    error = update(ErrorMock(), {
      response: {
        data: { $set: { non_field_errors: ['Invalid username or password.'] } },
      },
    })
    errorRes = { message: error.response.data['non_field_errors'][0], status: error.response.status }
    expect(parseError(error)).toEqual(errorRes)

    error = update(ErrorMock(), {
      response: {
        data: {
          $set: {
            email: ['Invalid', 'Required'],
            password: ['Mismatch'],
          },
        },
      },
    })
    errorRes = { message: error.response.data.email[0], status: error.response.status }
    expect(parseError(error)).toEqual(errorRes)

    error = update(ErrorMock(), {
      response: {
        data: { $set: { email: 'user with this email address already exists.' } },
      },
    })
    errorRes = { message: error.response.data.email, status: error.response.status }
    expect(parseError(error)).toEqual(errorRes)
  })

  it('getParameterSetErrorMessage', () => {
    const error1 = { message: 'The fields analysis_type, version must make a unique set.' }
    expect(getParameterSetErrorMessage(error1).includes('Duplicate')).toBeTruthy()

    const error2 = { message: 'A valid number is required.' }
    expect(getParameterSetErrorMessage(error2).includes('version')).toBeTruthy()

    const error3 = { message: 'Invalid' }
    expect(getParameterSetErrorMessage(error3).includes('Failed')).toBeTruthy()
  })
})
