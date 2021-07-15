import { all } from 'redux-saga/effects'
import { saga as analysesSaga } from 'store/modules/analyses'
import { saga as authSaga } from 'store/modules/auth'
import { saga as datafilesSaga } from 'store/modules/datafiles'
import { saga as mappingsSaga } from 'store/modules/mappings'
import { saga as sitesSaga } from 'store/modules/sites'

export default function* rootSaga() {
  yield all([analysesSaga(), authSaga(), datafilesSaga(), mappingsSaga(), sitesSaga()])
}
