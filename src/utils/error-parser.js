import { get, isArray, indexOf, head, keys, capitalize } from 'lodash'

export const parseError = error => {
  const errRes = get(error, 'response.data')
  const status = get(error, 'response.status')

  if (!errRes) {
    return { message: 'There was an unexpected error', status }
  }

  if (isArray(errRes)) {
    return { message: head(errRes), status }
  }

  if (indexOf(keys(errRes), 'non_field_errors') !== -1) {
    return { message: head(get(errRes, 'non_field_errors')), status }
  }

  const firstError = get(errRes, head(keys(errRes)))

  if (isArray(firstError)) {
    return { message: capitalize(firstError[0]), status }
  }

  return { message: firstError, status }
}

export const getParameterSetErrorMessage = error => {
  if (error.message === 'The fields analysis_type, version must make a unique set.') {
    return 'Duplicate parameter set version for this analysis.'
  }

  if (error.message === 'A valid number is required.') {
    return 'A number is required in the version.'
  }

  return 'Failed to create parameter set.'
}
