import axios from 'axios'
import qs from 'qs'
import { get } from 'lodash'
import { call, put, takeEvery } from 'redux-saga/effects'
import { notification } from 'antd'
import { encodePathURL } from 'utils/analyses'
import { showErrorToast } from 'utils/common'
import { parseError, getParameterSetErrorMessage } from 'utils/error-parser'
import { getAuthData } from 'utils/storage'
import * as actions from './actions'

export const doListDataFile = function*({ payload }) {
  try {
    const updatedPayload = {
      ...payload,
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    }
    const res = yield call(axios.get, `/data-file/`, updatedPayload)
    yield put(actions.listDataFileSuccess(res.data))
  } catch (error) {
    yield put(actions.listDataFileFail(parseError(error)))
  }
}

export const doGetDataFile = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/data-file/${payload}/`)
    yield put(actions.getDataFileSuccess(res.data))
  } catch (error) {
    yield put(actions.getDataFileFail(parseError(error)))
  }
}

export const doDeleteDataFile = function*({ payload }) {
  try {
    yield call(axios.delete, `/data-file/${payload}/`)
    yield put(actions.deleteDataFileSuccess(payload))
  } catch (error) {
    yield put(actions.deleteDataFileFail(parseError(error)))
  }
}

export const doListDataDirectory = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/data-directory/`, payload)
    yield put(actions.listDataDirectorySuccess(res.data))
  } catch (error) {
    yield put(actions.listDataDirectoryFail(parseError(error)))
  }
}

export const doRunMultipleAnalyses = function*({ payload }) {
  try {
    const res = yield call(axios.patch, `/data-directory/${payload}/run-multi/`)
    yield put(actions.runMultipleAnalysesSuccess(res.data))

    notification.success({ message: 'Started analyses successfully!' })
  } catch (error) {
    yield put(actions.runMultipleAnalysesFail(parseError(error)))
  }
}

export const doRunSingleAnalysis = function*({ payload }) {
  try {
    const res = yield call(axios.patch, `/data-directory/${payload.id}/run-single/${payload.planId}/`)
    yield put(actions.runSingleAnalysisSuccess(res.data))

    notification.success({ message: 'Started analysis successfully!' })
  } catch (error) {
    yield put(actions.runSingleAnalysisSuccess(parseError(error)))
  }
}

export const doUploadFiles = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/data-file/`, payload)
    yield put(actions.uploadFilesSuccess(res.data))

    notification.success({ message: 'Uploaded datafiles successfully!' })
  } catch (error) {
    notification.error({ message: 'Failed to upload datafiles!' })
    yield put(actions.uploadFilesFail(parseError(error)))
  }
}

export const doUploadMiscFiles = function*({ payload }) {
  try {
    const res = yield call(axios.post, '/misc-file/', payload)
    yield put(actions.uploadMiscFilesSuccess(res.data))

    notification.success({ message: 'Uploaded miscellaneous file successfully!' })
  } catch (error) {
    notification.error({ message: 'Failed to upload misc file!' })
    yield put(actions.uploadMiscFilesFail(parseError(error)))
  }
}

export const doListProtocolData = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/protocol-data/`, payload)
    yield put(actions.listProtocolDataSuccess(res.data))
  } catch (error) {
    yield put(actions.listProtocolDataFail(parseError(error)))
  }
}

export const doListParameterSet = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/parameter-set/`, payload)
    yield put(actions.listParameterSetSuccess(res.data))
  } catch (error) {
    yield put(actions.listParameterSetFail(parseError(error)))
  }
}

export const doCreateParameterSet = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/parameter-set/`, payload)
    yield put(actions.createParameterSetSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, getParameterSetErrorMessage(err))
    yield put(actions.createParameterSetFail(err))
  }
}

export const doGetParameterSet = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/parameter-set/${payload}/`)
    yield put(actions.getParameterSetSuccess(res.data))
  } catch (error) {
    yield put(actions.getParameterSetFail(parseError(error)))
  }
}

export const doUpdateParameterSet = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/parameter-set/${id}/`, data)
    yield put(actions.updateParameterSetSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, getParameterSetErrorMessage(err))
    yield put(actions.updateParameterSetFail(err))
  }
}

export const doDeleteParameterSet = function*({ payload }) {
  try {
    yield call(axios.delete, `/parameter-set/${payload}/`)
    yield put(actions.deleteParameterSetSuccess(payload))
  } catch (error) {
    yield put(actions.deleteParameterSetFail(parseError(error)))
  }
}

export const doCreateAnalysisPlan = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/analysis-plan/`, payload)
    yield put(actions.createAnalysisPlanSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.status === 400 ? 'Duplicate analysis plan for this protocol' : err.message)
    yield put(actions.createAnalysisPlanFail(err))
  }
}

export const doUpdateAnalysisPlan = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/analysis-plan/${id}/`, data)
    yield put(actions.updateAnalysisPlanSuccess(res.data))
  } catch (error) {
    yield put(actions.updateAnalysisPlanFail(parseError(error)))
  }
}

export const doDeleteAnalysisPlan = function*({ payload }) {
  try {
    yield call(axios.delete, `/analysis-plan/${payload.id}/`)
    yield put(actions.deleteAnalysisPlanSuccess(payload))
  } catch (error) {
    yield put(actions.deleteAnalysisPlanFail(parseError(error)))
  }
}

export const doListMetadata = function*({ payload }) {
  try {
    const payloadWithSerializer = {
      ...payload,
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
    }
    const res = yield call(axios.get, `/data-file/`, payloadWithSerializer)
    yield put(actions.listMetadataSuccess(res.data))
  } catch (error) {
    yield put(actions.listMetadataFail(parseError(error)))
  }
}

export const doGetMetadata = function*({ payload }) {
  try {
    const authData = getAuthData()
    const token = get(authData, 'token')
    const url = encodePathURL(null, payload, token)
    const res = yield call(axios.get, url)
    yield put(actions.getMetadataSuccess(res.data))
  } catch (error) {
    yield put(actions.getMetadataFail(parseError(error)))
  }
}

export const doListMiscFile = function*() {
  try {
    const res = yield call(axios.get, '/misc-file/')
    yield put(actions.listMiscFileSuccess(res.data))
  } catch (error) {
    yield put(actions.listMiscFileFail(parseError(error)))
  }
}

export const saga = function*() {
  yield takeEvery(actions.LIST_DATA_FILE, doListDataFile)
  yield takeEvery(actions.GET_DATA_FILE, doGetDataFile)
  yield takeEvery(actions.DELETE_DATA_FILE, doDeleteDataFile)

  yield takeEvery(actions.LIST_DATA_DIRECTORY, doListDataDirectory)
  yield takeEvery(actions.RUN_MULTIPLE_ANALYSES, doRunMultipleAnalyses)
  yield takeEvery(actions.RUN_SINGLE_ANALYSIS, doRunSingleAnalysis)

  yield takeEvery(actions.UPLOAD_FILES, doUploadFiles)
  yield takeEvery(actions.UPLOAD_MISC_FILES, doUploadMiscFiles)

  yield takeEvery(actions.LIST_PROTOCOL_DATA, doListProtocolData)

  yield takeEvery(actions.LIST_PARAMETER_SET, doListParameterSet)
  yield takeEvery(actions.CREATE_PARAMETER_SET, doCreateParameterSet)
  yield takeEvery(actions.GET_PARAMETER_SET, doGetParameterSet)
  yield takeEvery(actions.UPDATE_PARAMETER_SET, doUpdateParameterSet)
  yield takeEvery(actions.DELETE_PARAMETER_SET, doDeleteParameterSet)

  yield takeEvery(actions.LIST_METADATA, doListMetadata)
  yield takeEvery(actions.GET_METADATA, doGetMetadata)

  yield takeEvery(actions.CREATE_ANALYSIS_PLAN, doCreateAnalysisPlan)
  yield takeEvery(actions.UPDATE_ANALYSIS_PLAN, doUpdateAnalysisPlan)
  yield takeEvery(actions.DELETE_ANALYSIS_PLAN, doDeleteAnalysisPlan)

  yield takeEvery(actions.LIST_MISC_FILE, doListMiscFile)
}
