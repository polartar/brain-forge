import {
  selectSitesState,
  selectSites,
  selectSite,
  selectStudies,
  selectUploadableStudies,
  selectStudy,
  selectAllScanners,
  selectScanners,
  selectScanner,
  selectAllSubjects,
  selectAllSessions,
  selectSessions,
  selectAllSeries,
  selectSeries,
  selectTag,
  selectTags,
  selectSitesStatus,
  selectSitesError,
} from '../selectors'

const state = {
  sites: {
    sites: [],
    site: null,
    studies: [],
    study: null,
    allScanners: [],
    allSubject: [],
    allSessions: [],
    allSeries: [],
    series: [],
    scanners: {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      results: [],
    },
    scanner: null,
    sessions: {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      results: [],
    },
    uploadableStudies: [],
    tag: null,
    tags: [],
    status: 'INIT',
    error: null,
  },
}

describe('Sites selectors', () => {
  it('tests', () => {
    const { sites } = state

    expect(selectSitesState(state)).toEqual(sites)
    expect(selectSites(state)).toEqual(sites.sites)
    expect(selectSite(state)).toEqual(sites.site)
    expect(selectStudies(state)).toEqual(sites.studies)
    expect(selectUploadableStudies(state)).toEqual(sites.uploadableStudies)
    expect(selectStudy(state)).toEqual(sites.study)
    expect(selectAllScanners(state)).toEqual(sites.allScanners)
    expect(selectScanners(state)).toEqual(sites.scanners)
    expect(selectScanner(state)).toEqual(sites.scanner)
    expect(selectAllSubjects(state)).toEqual(sites.allSubjects)
    expect(selectAllSessions(state)).toEqual(sites.allSessions)
    expect(selectSessions(state)).toEqual(sites.sessions)
    expect(selectAllSeries(state)).toEqual(sites.allSeries)
    expect(selectSeries(state)).toEqual(sites.series)
    expect(selectTags(state)).toEqual(sites.tags)
    expect(selectTag(state)).toEqual(sites.tag)
    expect(selectSitesStatus(state)).toEqual(sites.status)
    expect(selectSitesError(state)).toEqual(sites.error)
  })
})
