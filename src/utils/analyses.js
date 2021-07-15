import React from 'react'
import axios from 'axios'
import { notification, Alert } from 'antd'
import update from 'immutability-helper'
import { get, find, filter, map, mapKeys, merge, reduce, takeRight } from 'lodash'
import moment from 'moment'
import { getAuthData } from 'utils/storage'
import {
  DATA_TYPES,
  DEFAULT_FORMULA_TYPE,
  VARIABLE_EFFECTS,
  VARIABLE_ROLES,
  VARIABLE_TYPES,
  ANALYSIS_STATES,
  API_BASE_URL,
} from 'config/base'

export const prepareAnalysis = analysis =>
  merge(analysis, {
    options: {
      dropMissing: true,
      formula: undefined,
      formulaType: DEFAULT_FORMULA_TYPE,
    },
  })

export const prepareField = field => ({
  index: field.index,
  name: field.name,
  data_type: field.data_type || DATA_TYPES.numeric.code,
  data_unique: field.data_unique,
  data_labels: field.data_labels,
  selected: false,
  variable_role: field.variable_role || VARIABLE_ROLES.x.code,
  variable_type: field.variable_type || VARIABLE_TYPES.continuous.code,
  transformation: field.transformation || undefined,
  effect: field.effect || VARIABLE_EFFECTS.fixed.code,
})

export const prepareFields = fields => map(fields, (field, name) => prepareField(merge(field, { name })))

export const prepareFieldNames = fieldNames =>
  reduce(
    fieldNames,
    (result, name, index) => {
      result[index] = prepareField({ name, index })
      return result
    },
    {},
  )

export const normalizeFileFields = file => {
  const preparedFields = prepareFields(file.fields)
  return update(file, {
    fields: { $set: mapKeys(preparedFields, f => f.index) },
  })
}

export const validateFileFields = file => {
  const numberOfFeatures = filter(file.fields, field => field.selected && field.variable_role === VARIABLE_ROLES.x.code)
    .length

  const limit = file.number_of_rows - 1

  if (numberOfFeatures > limit) {
    return `Invalid number of features ${numberOfFeatures} is greater than ${limit} (number of rows - 1)`
  }
}

export const makeId = (len = 5) => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'

  for (let i = 0; i < len; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

export const getAnalysisDefaultSorter = (type, stringify = true) => {
  const sorter = get(ANALYSIS_STATES, [type, 'defaultSorter'])

  return stringify ? getOrderingParam(sorter) : sorter
}

export const getOrderingParam = sorter => {
  const { field, order } = sorter

  return field && order ? `${order === 'descend' ? '-' : ''}${field}` : undefined
}

export const parseOrderingParam = ordering => {
  if (!ordering) {
    return {}
  }

  if (ordering[0] === '-') {
    return { order: 'descend', field: ordering.substr(1), columnKey: ordering.substr(1) }
  }

  return { order: 'ascend', field: ordering, columnKey: ordering }
}

export const prepareDownloadResult = id => {
  /* istanbul ignore next */
  notification.success({ message: 'Preparing download file! Please check your notifications after a few minutes' })
  return axios.post(`/analysis/${id}/prepare_download/`)
}

export const downloadResult = path => {
  // The process to download a large zip file is:
  // 1. Get a auth token.
  // 2. Open a new tab with the token for browser download.
  const authData = getAuthData()
  const token = get(authData, 'token')
  const url = encodePathURL(null, path, token)
  window.open(url, '_blank')
}

export const downloadCLI = () => {
  axios.get(`${API_BASE_URL}/download-cli`, { responseType: 'blob' }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'cli.zip')
    document.body.appendChild(link)
    link.click()
  })
}

export const downloadHTML = id => {
  /* istanbul ignore next */
  return axios.get(`/analysis/${id}/download_html/`, { responseType: 'text' }).then(file => {
    const contentType = file.headers['content-type']
    const filename = contentType && contentType.indexOf('html') !== -1 ? 'result.html' : null
    if (filename !== null) {
      return file.data
    }
  })
}

export const getAnalysisLabel = (analysisTypes, parameterSet) => {
  return get(find(analysisTypes, { id: parameterSet.analysis_type }), 'label')
}

export const renderErrors = errorStr => {
  const errors = errorStr.split(';;;')

  return errors.map((error, ind) => {
    const elements = error.split(':::')
    const description = elements.slice(1).join(':::')
    const formattedDesc = description ? description.replace(/\\n/g, ' \n') : null

    return (
      formattedDesc && (
        <Alert key={ind} message={get(elements, 0)} description={formattedDesc} type="error" showIcon banner />
      )
    )
  })
}

export const trimFileExt = filename =>
  filename
    .split('.')
    .slice(0, -1)
    .join('.')

export const shortenFilename = filename => takeRight(filename.split('/'), 3).join('/')

export const pushOrPopToArray = (arr, item) => {
  if (arr.includes(item)) {
    return arr.filter(elem => elem !== item)
  }

  return [...arr, item]
}

export const encodePathURL = (outDir, path, token) => {
  const fullPath = outDir ? `${outDir}/${path}` : path

  return `${API_BASE_URL}/files/?path=${encodeURIComponent(fullPath)}&token=${token}`
}

export const getAnalysisLegend = analysis => {
  return `${moment(analysis.anon_date).format('DD-MMM-YYYY h:mm:ss')}-${analysis.session}-${analysis.series}`
}
