import { combineReducers } from 'redux'
import { reducer as globalReducer } from 'store/modules/global'
import { reducer as analysesReducer } from 'store/modules/analyses'
import { reducer as authReducer } from 'store/modules/auth'
import { reducer as datafilesReducer } from 'store/modules/datafiles'
import { reducer as mappingsReducer } from 'store/modules/mappings'
import { reducer as sitesReducer } from 'store/modules/sites'

export default combineReducers({
  global: globalReducer,
  analyses: analysesReducer,
  auth: authReducer,
  datafiles: datafilesReducer,
  mappings: mappingsReducer,
  sites: sitesReducer,
})
