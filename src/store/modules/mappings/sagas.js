import axios from 'axios'
import { call, put, takeEvery } from 'redux-saga/effects'
import { showErrorToast } from 'utils/common'
import { parseError } from 'utils/error-parser'
import * as actions from './actions'

export const doListProtocol = function*() {
  try {
    const res = yield call(axios.get, `/protocol/`)
    yield put(actions.listProtocolSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.listProtocolFail(err))
  }
}

export const doListProtocolMapping = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/protocol-mapping/`, payload)
    yield put(actions.listProtocolMappingSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.listProtocolMappingFail(err))
  }
}

export const doCreateProtocolMapping = function*({ payload }) {
  try {
    const res = yield call(axios.post, `/protocol-mapping/`, payload)
    yield put(actions.createProtocolMappingSuccess(res.data))
    yield put(actions.listProtocolMapping())
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.createProtocolMappingFail(err))
  }
}

export const doUpdateProtocolMapping = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/protocol-mapping/${id}/`, data)
    yield put(actions.updateProtocolMappingSuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.updateProtocolMappingFail(err))
  }
}

export const doDeleteProtocolMapping = function*({ payload }) {
  try {
    yield call(axios.delete, `/protocol-mapping/${payload}/`)
    yield put(actions.deleteProtocolMappingSuccess(payload))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.deleteProtocolMappingFail(err))
  }
}

export const doListModality = function*() {
  try {
    const res = yield call(axios.get, `/modality/`)
    yield put(actions.listModalitySuccess(res.data))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.listModalityFail(err))
  }
}

export const saga = function*() {
  yield takeEvery(actions.LIST_PROTOCOL, doListProtocol)
  yield takeEvery(actions.LIST_PROTOCOL_MAPPING, doListProtocolMapping)
  yield takeEvery(actions.CREATE_PROTOCOL_MAPPING, doCreateProtocolMapping)
  yield takeEvery(actions.UPDATE_PROTOCOL_MAPPING, doUpdateProtocolMapping)
  yield takeEvery(actions.DELETE_PROTOCOL_MAPPING, doDeleteProtocolMapping)
  yield takeEvery(actions.LIST_MODALITY, doListModality)
}
