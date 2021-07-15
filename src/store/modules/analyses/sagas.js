import axios from 'axios'
import { call, put, select, takeEvery } from 'redux-saga/effects'
import { find, get } from 'lodash'
import { SOCKET_PATH } from 'config/base'
import { selectCurrentFiles, selectParameterSets } from 'store/modules/datafiles'
import { parseError } from 'utils/error-parser'
import { showErrorToast, openToastr } from 'utils/common'

import * as actions from './actions'

export const doListProblemSet = function*() {
  try {
    const res = yield call(axios.get, `/problem-set/`)
    yield put(actions.listProblemSetSuccess(res.data))
  } catch (error) {
    yield put(actions.listProblemSetFail(parseError(error)))
  }
}

export const doGetProblemSet = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/problem-set/${payload}/`)
    yield put(actions.getProblemSetSuccess(res.data))
  } catch (error) {
    yield put(actions.getProblemSetFail(parseError(error)))
  }
}

export const doListSolutionSet = function*() {
  try {
    const res = yield call(axios.get, `/solution-set/`)
    yield put(actions.listSolutionSetSuccess(res.data))
  } catch (error) {
    yield put(actions.listSolutionSetFail(parseError(error)))
  }
}

export const doGetSolutionSet = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/solution-set/${payload}/`)
    yield put(actions.getSolutionSetSuccess(res.data))
  } catch (error) {
    yield put(actions.getSolutionSetFail(parseError(error)))
  }
}

export const doListAnalysisType = function*() {
  try {
    const res = yield call(axios.get, `/analysis-type/`)
    yield put(actions.listAnalysisTypeSuccess(res.data))
  } catch (error) {
    yield put(actions.listAnalysisTypeFail(parseError(error)))
  }
}

export const doGetAnalysisType = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/analysis-type/${payload}/`)
    yield put(actions.getAnalysisTypeSuccess(res.data))
    yield put(actions.setAnalysisType(payload))
  } catch (error) {
    yield put(actions.getAnalysisTypeFail(parseError(error)))
  }
}

export const doInitAnalysis = function*({ payload }) {
  const currentFiles = yield select(selectCurrentFiles)
  const parameterSets = yield select(selectParameterSets)
  const { parameter_set, name, description, group_analysis, ...options } = payload.options
  const parameterSet = find(parameterSets, { id: parameter_set.value })

  const data = {
    file: {
      file: get(currentFiles, '0.id'),
      fields: get(currentFiles, '0.fields'),
    },
    options: {
      ...parameterSet.options,
      ...options,
      files: {
        value: currentFiles,
      },
    },
    name: name.value,
    description: get(description, 'value', ''),
    parameter_set: parameter_set.value,
    group_analysis: group_analysis.value,
  }

  try {
    const res = yield call(axios.post, `/analysis/`, data)
    yield put(actions.initAnalysisSuccess())

    const socketUrl = `${SOCKET_PATH}/ws/analysis/${res.data.id}/`
    new WebSocket(socketUrl)

    payload.history.push(`/status/`)

    yield call(openToastr, 'success', 'Analysis Started')
  } catch (error) {
    yield put(actions.initAnalysisFail(parseError(error)))
  }
}

export const doListAnalysis = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/analysis/`, payload)
    yield put(actions.listAnalysisSuccess(res.data))
  } catch (error) {
    yield put(actions.listAnalysisFail(parseError(error)))
  }
}

export const doGetAnalysis = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/analysis/${payload}/`)
    yield put(actions.getAnalysisSuccess(res.data))
  } catch (error) {
    yield put(actions.getAnalysisFail(parseError(error)))
  }
}

export const doUpdateAnalysis = function*({ payload }) {
  const { id, data } = payload

  try {
    const res = yield call(axios.patch, `/analysis/${id}/`, data)
    yield put(actions.updateAnalysisSuccess(res.data))
  } catch (error) {
    yield put(actions.updateAnalysisFail(parseError(error)))
  }
}

export const doDeleteAnalysis = function*({ payload }) {
  try {
    yield call(axios.delete, `/analysis/${payload}/`)
    yield put(actions.deleteAnalysisSuccess(payload))
  } catch (error) {
    const err = parseError(error)
    yield call(showErrorToast, err.message)
    yield put(actions.deleteAnalysisFail(err))
  }
}

export const doListAnalysisUsers = function*({ payload }) {
  try {
    const res = yield call(axios.get, `/analysis/users/`)
    yield put(actions.listAnalysisUserSuccess(res.data))
  } catch (error) {
    yield put(actions.listAnalysisUserFail(parseError(error)))
  }
}

export const saga = function*() {
  yield takeEvery(actions.LIST_PROBLEM_SET, doListProblemSet)
  yield takeEvery(actions.GET_PROBLEM_SET, doGetProblemSet)
  yield takeEvery(actions.LIST_SOLUTION_SET, doListSolutionSet)
  yield takeEvery(actions.GET_SOLUTION_SET, doGetSolutionSet)
  yield takeEvery(actions.LIST_ANALYSIS_TYPE, doListAnalysisType)
  yield takeEvery(actions.GET_ANALYSIS_TYPE, doGetAnalysisType)
  yield takeEvery(actions.INIT_ANALYSIS, doInitAnalysis)
  yield takeEvery(actions.LIST_ANALYSIS, doListAnalysis)
  yield takeEvery(actions.GET_ANALYSIS, doGetAnalysis)
  yield takeEvery(actions.UPDATE_ANALYSIS, doUpdateAnalysis)
  yield takeEvery(actions.DELETE_ANALYSIS, doDeleteAnalysis)
  yield takeEvery(actions.LIST_ANALYSIS_USER, doListAnalysisUsers)
}
