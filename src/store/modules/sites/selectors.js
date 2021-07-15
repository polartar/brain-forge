import { get } from 'lodash'

export const selectSitesState = state => get(state, 'sites')

export const selectSites = state => get(state, 'sites.sites')

export const selectSite = state => get(state, 'sites.site')

export const selectStudies = state => get(state, 'sites.studies')

export const selectUploadableStudies = state => get(state, 'sites.uploadableStudies')

export const selectStudy = state => get(state, 'sites.study')

export const selectAllScanners = state => get(state, 'sites.allScanners')

export const selectScanners = state => get(state, 'sites.scanners')

export const selectScanner = state => get(state, 'sites.scanner')

export const selectAllSubjects = state => get(state, 'sites.allSubjects')

export const selectAllSessions = state => get(state, 'sites.allSessions')

export const selectSessions = state => get(state, 'sites.sessions')

export const selectAllSeries = state => get(state, 'sites.allSeries')

export const selectSeries = state => get(state, 'sites.series')

export const selectTags = state => get(state, 'sites.tags')

export const selectTag = state => get(state, 'sites.tag')

export const selectSitesStatus = state => get(state, 'sites.status')

export const selectSitesError = state => get(state, 'sites.error')
