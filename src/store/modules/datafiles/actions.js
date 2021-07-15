import { createAction } from 'redux-actions'
import { successAction, failAction } from 'utils/state-helpers'

/**
 * Constants
 */
export const LIST_DATA_FILE = 'LIST_DATA_FILE'
export const GET_DATA_FILE = 'GET_DATA_FILE'
export const DELETE_DATA_FILE = 'DELETE_DATA_FILE'

export const LIST_DATA_DIRECTORY = 'LIST_DATA_DIRECTORY'

export const RUN_MULTIPLE_ANALYSES = 'RUN_MULTIPLE_ANALYSES'

export const RUN_SINGLE_ANALYSIS = 'RUN_SINGLE_ANALYSIS'

export const UPLOAD_FILES = 'UPLOAD_FILES'
export const UPLOAD_MISC_FILES = 'UPLOAD_MISC_FILES'

export const LIST_PROTOCOL_DATA = 'LIST_PROTOCOL_DATA'

export const LIST_PARAMETER_SET = 'LIST_PARAMETER_SET'
export const CREATE_PARAMETER_SET = 'CREATE_PARAMETER_SET'
export const GET_PARAMETER_SET = 'GET_PARAMETER_SET'
export const UPDATE_PARAMETER_SET = 'UPDATE_PARAMETER_SET'
export const DELETE_PARAMETER_SET = 'DELETE_PARAMETER_SET'

export const CREATE_ANALYSIS_PLAN = 'CREATE_ANALYSIS_PLAN'
export const UPDATE_ANALYSIS_PLAN = 'UPDATE_ANALYSIS_PLAN'
export const DELETE_ANALYSIS_PLAN = 'DELETE_ANALYSIS_PLAN'

export const SET_CURRENT_FILES = 'SET_CURRENT_FILES'
export const SET_ALL_FILES = 'SET_ALL_FILES'
export const INITIALIZE_CURRENT_FILES = 'INITIALIZE_CURRENT_FILES'
export const UPDATE_CURRENT_FILES_FIELD = 'UPDATE_CURRENT_FILES_FIELD'
export const UPDATE_CURRENT_FILE_FIELDS = 'UPDATE_CURRENT_FILE_FIELDS'
export const TOGGLE_ALL_CURRENT_FILES_FIELD = 'TOGGLE_ALL_CURRENT_FILES_FIELD'

export const CLEAR_PROTOCOL_DATA = 'CLEAR_PROTOCOL_DATA'
export const SET_ANALYSIS_LOCATION = 'SET_ANALYSIS_LOCATION'

export const LIST_METADATA = 'LIST_METADATA'
export const GET_METADATA = 'GET_METADATA'

export const LIST_MISC_FILE = 'LIST_MISC_FILE'
/**
 * Action creators
 */

export const listDataFile = createAction(LIST_DATA_FILE)
export const listDataFileSuccess = createAction(successAction(LIST_DATA_FILE))
export const listDataFileFail = createAction(failAction(LIST_DATA_FILE))

export const getDataFile = createAction(GET_DATA_FILE)
export const getDataFileSuccess = createAction(successAction(GET_DATA_FILE))
export const getDataFileFail = createAction(failAction(GET_DATA_FILE))

export const deleteDataFile = createAction(DELETE_DATA_FILE)
export const deleteDataFileSuccess = createAction(successAction(DELETE_DATA_FILE))
export const deleteDataFileFail = createAction(failAction(DELETE_DATA_FILE))

export const listDataDirectory = createAction(LIST_DATA_DIRECTORY)
export const listDataDirectorySuccess = createAction(successAction(LIST_DATA_DIRECTORY))
export const listDataDirectoryFail = createAction(failAction(LIST_DATA_DIRECTORY))

export const uploadFiles = createAction(UPLOAD_FILES)
export const uploadFilesSuccess = createAction(successAction(UPLOAD_FILES))
export const uploadFilesFail = createAction(failAction(UPLOAD_FILES))

export const uploadMiscFiles = createAction(UPLOAD_MISC_FILES)
export const uploadMiscFilesSuccess = createAction(successAction(UPLOAD_MISC_FILES))
export const uploadMiscFilesFail = createAction(failAction(UPLOAD_MISC_FILES))

export const runMultipleAnalyses = createAction(RUN_MULTIPLE_ANALYSES)
export const runMultipleAnalysesSuccess = createAction(successAction(RUN_MULTIPLE_ANALYSES))
export const runMultipleAnalysesFail = createAction(failAction(RUN_MULTIPLE_ANALYSES))

export const runSingleAnalysis = createAction(RUN_SINGLE_ANALYSIS)
export const runSingleAnalysisSuccess = createAction(successAction(RUN_SINGLE_ANALYSIS))
export const runSingleAnalysisFail = createAction(failAction(RUN_SINGLE_ANALYSIS))

export const listProtocolData = createAction(LIST_PROTOCOL_DATA)
export const listProtocolDataSuccess = createAction(successAction(LIST_PROTOCOL_DATA))
export const listProtocolDataFail = createAction(failAction(LIST_PROTOCOL_DATA))

export const listParameterSet = createAction(LIST_PARAMETER_SET)
export const listParameterSetSuccess = createAction(successAction(LIST_PARAMETER_SET))
export const listParameterSetFail = createAction(failAction(LIST_PARAMETER_SET))

export const createParameterSet = createAction(CREATE_PARAMETER_SET)
export const createParameterSetSuccess = createAction(successAction(CREATE_PARAMETER_SET))
export const createParameterSetFail = createAction(failAction(CREATE_PARAMETER_SET))

export const getParameterSet = createAction(GET_PARAMETER_SET)
export const getParameterSetSuccess = createAction(successAction(GET_PARAMETER_SET))
export const getParameterSetFail = createAction(failAction(GET_PARAMETER_SET))

export const updateParameterSet = createAction(UPDATE_PARAMETER_SET)
export const updateParameterSetSuccess = createAction(successAction(UPDATE_PARAMETER_SET))
export const updateParameterSetFail = createAction(failAction(UPDATE_PARAMETER_SET))

export const deleteParameterSet = createAction(DELETE_PARAMETER_SET)
export const deleteParameterSetSuccess = createAction(successAction(DELETE_PARAMETER_SET))
export const deleteParameterSetFail = createAction(failAction(DELETE_PARAMETER_SET))

export const createAnalysisPlan = createAction(CREATE_ANALYSIS_PLAN)
export const createAnalysisPlanSuccess = createAction(successAction(CREATE_ANALYSIS_PLAN))
export const createAnalysisPlanFail = createAction(failAction(CREATE_ANALYSIS_PLAN))

export const updateAnalysisPlan = createAction(UPDATE_ANALYSIS_PLAN)
export const updateAnalysisPlanSuccess = createAction(successAction(UPDATE_ANALYSIS_PLAN))
export const updateAnalysisPlanFail = createAction(failAction(UPDATE_ANALYSIS_PLAN))

export const deleteAnalysisPlan = createAction(DELETE_ANALYSIS_PLAN)
export const deleteAnalysisPlanSuccess = createAction(successAction(DELETE_ANALYSIS_PLAN))
export const deleteAnalysisPlanFail = createAction(failAction(DELETE_ANALYSIS_PLAN))

export const setCurrentFiles = createAction(SET_CURRENT_FILES)
export const setAllFiles = createAction(SET_ALL_FILES)
export const initializeCurrentFiles = createAction(INITIALIZE_CURRENT_FILES)
export const updateCurrentFilesField = createAction(UPDATE_CURRENT_FILES_FIELD)
export const updateCurrentFileFields = createAction(UPDATE_CURRENT_FILE_FIELDS)
export const toggleAllCurrentFilesField = createAction(TOGGLE_ALL_CURRENT_FILES_FIELD)

export const clearProtocolData = createAction(CLEAR_PROTOCOL_DATA)

export const setAnalysisLocation = createAction(SET_ANALYSIS_LOCATION)

export const listMetadata = createAction(LIST_METADATA)
export const listMetadataSuccess = createAction(successAction(LIST_METADATA))
export const listMetadataFail = createAction(failAction(LIST_METADATA))

export const getMetadata = createAction(GET_METADATA)
export const getMetadataSuccess = createAction(successAction(GET_METADATA))
export const getMetadataFail = createAction(failAction(GET_METADATA))

export const listMiscFile = createAction(LIST_MISC_FILE)
export const listMiscFileSuccess = createAction(successAction(LIST_MISC_FILE))
export const listMiscFileFail = createAction(failAction(LIST_MISC_FILE))
