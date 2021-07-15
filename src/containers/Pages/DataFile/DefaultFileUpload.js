import React, { useState, Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { find, first, forEach, get, keys, omit, orderBy, take, indexOf } from 'lodash'
import { Button, Form, Upload, Icon } from 'antd'
import { selectModalities } from 'store/modules/mappings'
import { selectLoggedInUser } from 'store/modules/auth'
import {
  listSite,
  listStudy,
  createStudy,
  listAllScanner,
  createScanner,
  listAllSubject,
  createSubject,
  listAllSession,
  createSession,
  listAllSeries,
  createSeries,
  selectSites,
  selectStudies,
  selectAllScanners,
  selectAllSubjects,
  selectAllSessions,
  selectAllSeries,
  selectSitesStatus,
  CREATE_STUDY,
  CREATE_SCANNER,
  CREATE_SUBJECT,
  CREATE_SESSION,
  CREATE_SERIES,
} from 'store/modules/sites'
import { UPLOAD_FILES } from 'store/modules/datafiles'
import { successAction } from 'utils/state-helpers'
import { Drawer, StudyForm, ScannerForm, SubjectForm, SessionForm, SeriesForm, Select, Option } from 'components'

const { Item: FormItem } = Form
const FIELDS = ['study', 'scanner', 'subject', 'session', 'series']

export const DefaultFileUploadForm = props => {
  const {
    status,
    user,
    sites,
    studies,
    allScanners,
    allSubjects,
    allSessions,
    allSeries,
    dataFileStatus,
    modalities,
  } = props

  const [values, setValues] = useState({
    study: '',
    scanner: '',
    subject: '',
    session: '',
    series: '',
    upload: null,
  })
  const [showStudyDrawer, setShowStudyDrawer] = useState(false)
  const [showScannerDrawer, setShowScannerDrawer] = useState(false)
  const [showSubjectDrawer, setShowSubjectDrawer] = useState(false)
  const [showSessionDrawer, setShowSessionDrawer] = useState(false)
  const [showSeriesDrawer, setShowSeriesDrawer] = useState(false)

  useEffect(() => {
    props.listSite()
    props.listStudy()
  }, [])

  useEffect(() => {
    if (status === successAction(CREATE_STUDY)) {
      setShowStudyDrawer(!showStudyDrawer)
      handleSearchData('study', getLastElementById(studies))
    }

    if (status === successAction(CREATE_SCANNER)) {
      setShowScannerDrawer(!showScannerDrawer)
      handleSearchData('scanner', getLastElementById(allScanners))
    }

    if (status === successAction(CREATE_SUBJECT)) {
      setShowSubjectDrawer(!showSubjectDrawer)
      handleSearchData('subject', getLastElementById(allSubjects))
    }

    if (status === successAction(CREATE_SESSION)) {
      setShowSessionDrawer(!showSessionDrawer)
      handleSearchData('session', getLastElementById(allSessions))
    }

    if (status === successAction(CREATE_SERIES)) {
      setShowSeriesDrawer(!showSeriesDrawer)
      handleSearchData('series', getLastElementById(allSeries))
      props.listStudy()
    }
  }, [status])

  const getLastElementById = elements => {
    return get(first(orderBy(elements, ['id'], ['desc'])), 'id')
  }

  const getStudySiteId = study => {
    return get(find(studies, { id: study }), 'site.id')
  }

  const handleChangeField = (fieldName, value) => {
    handleSearchData(fieldName, value)
  }

  const handleSearchData = (fieldName, value) => {
    const fields = ['series', 'session', 'subject', 'scanner', 'study', 'upload']

    const newValues = take(fields, indexOf(fields, fieldName)).reduce(
      (acc, elem) => {
        acc[elem] = null
        return acc
      },
      { ...values, [fieldName]: value },
    )

    setValues(newValues)

    const { study, subject, scanner, session } = newValues

    if (fieldName === 'study') {
      const studySiteId = getStudySiteId(study)

      props.listAllScanner({ params: { site: studySiteId } })

      return
    }

    if (fieldName === 'scanner') {
      props.listAllSubject({ params: { study } })

      return
    }

    if (fieldName === 'subject') {
      props.listAllSession({ params: { subject, scanner } })

      return
    }

    if (fieldName === 'session') {
      props.listAllSeries({ params: { session } })

      return
    }
  }

  const handleStudySubmit = ({ data }) => {
    props.createStudy(data)
  }

  const handleScannerSubmit = ({ data }) => {
    const { study } = values
    const studySiteId = getStudySiteId(study)

    props.createScanner({ ...data, site: studySiteId })
  }

  const handleSubjectSubmit = ({ data }) => {
    const { study } = values

    props.createSubject({ ...data, study })
  }

  const handleSessionSubmit = ({ data }) => {
    const { subject, scanner } = values

    props.createSession({ ...data, subject, scanner })
  }

  const handleSeriesSubmit = ({ data }) => {
    const { session } = values

    props.createSeries({ ...data, session })
  }

  const handleSubmit = () => {
    const { upload } = values
    const formData = new FormData()

    forEach(FIELDS, field => {
      formData.append(field, get(values, field))
    })

    upload.fileList.forEach(file => {
      formData.append('files', file.originFileObj)
    })

    props.onSubmit(formData)
  }

  const canUpload = () => {
    const uploadData = omit(values, ['default'])

    for (var key of keys(uploadData)) {
      if (!uploadData[key]) {
        return false
      }
    }

    return true
  }

  const mappings = get(find(studies, { id: values.study }), 'protocol_mappings', [])

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }

  const tailFormItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 8, offset: 8 },
    },
  }

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    height: 40,
  }

  const addBtnStyle = {
    style: { marginLeft: 10 },
    type: 'primary',
    shape: 'circle',
    icon: 'plus',
    size: 'small',
  }

  return (
    <Fragment>
      <FormItem {...formItemLayout} label="Study">
        <div style={wrapperStyle}>
          <Select
            className="w-100"
            value={values.study}
            onChange={value => {
              handleChangeField('study', value)
            }}
          >
            {studies.map(({ id, full_name }) => (
              <Option key={id} value={id}>
                {full_name}
              </Option>
            ))}
          </Select>
          <Button {...addBtnStyle} className="study-add-btn" onClick={() => setShowStudyDrawer(!showStudyDrawer)} />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="Scanner">
        <div style={wrapperStyle}>
          <Select
            className="w-100"
            value={values.scanner}
            disabled={!values.study}
            onChange={value => handleChangeField('scanner', value)}
          >
            {allScanners.map(({ id, full_name }) => (
              <Option key={id} value={id}>
                {full_name}
              </Option>
            ))}
          </Select>

          <Button
            {...addBtnStyle}
            className="scanner-add-btn"
            disabled={!values.study}
            onClick={() => setShowScannerDrawer(!showScannerDrawer)}
          />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="Subject">
        <div style={wrapperStyle}>
          <Select
            className="w-100"
            value={values.subject}
            disabled={!values.scanner}
            onChange={value => handleChangeField('subject', value)}
          >
            {allSubjects.map(({ id, anon_id }) => (
              <Option key={id} value={id}>
                {anon_id}
              </Option>
            ))}
          </Select>
          <Button
            {...addBtnStyle}
            className="subject-add-btn"
            disabled={!values.scanner}
            onClick={() => setShowSubjectDrawer(!showSubjectDrawer)}
          />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="Session">
        <div style={wrapperStyle}>
          <Select
            className="w-100"
            value={values.session}
            disabled={!values.subject}
            onChange={value => handleChangeField('session', value)}
          >
            {allSessions.map(({ id, segment_interval }) => (
              <Option key={id} value={id}>
                {segment_interval}
              </Option>
            ))}
          </Select>
          <Button
            {...addBtnStyle}
            className="session-add-btn"
            disabled={!values.subject}
            onClick={() => setShowSessionDrawer(!showSessionDrawer)}
          />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="Series">
        <div style={wrapperStyle}>
          <Select
            className="w-100"
            value={values.series}
            disabled={!values.session}
            onChange={value => handleChangeField('series', value)}
          >
            {allSeries.map(({ id, label }) => (
              <Option key={id} value={id}>
                {label}
              </Option>
            ))}
          </Select>
          <Button
            {...addBtnStyle}
            className="series-add-btn"
            disabled={!values.session}
            onClick={() => setShowSeriesDrawer(!showSeriesDrawer)}
          />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="File(s)">
        <Upload
          name="upload"
          multiple
          className="w-100"
          onChange={value => setValues({ ...values, upload: value })}
          beforeUpload={() => false}
        >
          <Button className="w-100">
            <Icon type="upload" /> File
          </Button>
        </Upload>
      </FormItem>

      <FormItem {...tailFormItemLayout}>
        <Button
          className="upload-btn w-100"
          type="primary"
          disabled={!canUpload()}
          loading={dataFileStatus === UPLOAD_FILES}
          onClick={handleSubmit}
        >
          Upload
        </Button>
      </FormItem>

      <Drawer title="Create study" visible={showStudyDrawer} onClose={() => setShowStudyDrawer(!showStudyDrawer)}>
        <StudyForm
          sites={sites}
          user={user}
          submitting={status === CREATE_STUDY}
          onSubmit={handleStudySubmit}
          onCancel={() => setShowStudyDrawer(!showStudyDrawer)}
        />
      </Drawer>

      <Drawer
        title="Create scanner"
        visible={showScannerDrawer}
        onClose={() => setShowScannerDrawer(!showScannerDrawer)}
      >
        <ScannerForm
          submitting={status === CREATE_SCANNER}
          onSubmit={handleScannerSubmit}
          onCancel={() => setShowScannerDrawer(!showScannerDrawer)}
        />
      </Drawer>

      <Drawer
        title="Create subject"
        visible={showSubjectDrawer}
        onClose={() => setShowSubjectDrawer(!showSubjectDrawer)}
      >
        <SubjectForm
          submitting={status === CREATE_SUBJECT}
          onSubmit={handleSubjectSubmit}
          onCancel={() => setShowSubjectDrawer(!showSubjectDrawer)}
        />
      </Drawer>

      <Drawer
        title="Create session"
        visible={showSessionDrawer}
        onClose={() => setShowSessionDrawer(!showSessionDrawer)}
      >
        <SessionForm
          submitting={status === CREATE_SESSION}
          onSubmit={handleSessionSubmit}
          onCancel={() => setShowSessionDrawer(!showSessionDrawer)}
        />
      </Drawer>

      <Drawer title="Create series" visible={showSeriesDrawer} onClose={() => setShowSeriesDrawer(!showSeriesDrawer)}>
        <SeriesForm
          submitting={status === CREATE_SERIES}
          modalities={modalities}
          mappings={mappings}
          onSubmit={handleSeriesSubmit}
          onCancel={() => setShowSeriesDrawer(!showSeriesDrawer)}
        />
      </Drawer>
    </Fragment>
  )
}

const selectors = createStructuredSelector({
  sites: selectSites,
  studies: selectStudies,
  user: selectLoggedInUser,
  modalities: selectModalities,
  allScanners: selectAllScanners,
  allSubjects: selectAllSubjects,
  allSessions: selectAllSessions,
  allSeries: selectAllSeries,
  status: selectSitesStatus,
})

const actions = {
  listSite,
  listStudy,
  createStudy,
  listAllScanner,
  createScanner,
  listAllSubject,
  createSubject,
  listAllSession,
  createSession,
  listAllSeries,
  createSeries,
}

DefaultFileUploadForm.propTypes = {
  user: PropTypes.object,
  status: PropTypes.string,
  sites: PropTypes.array,
  studies: PropTypes.array,
  modalities: PropTypes.array,
  dataFileStatus: PropTypes.string,
  allScanners: PropTypes.array,
  allSubjects: PropTypes.array,
  allSessions: PropTypes.array,
  allSeries: PropTypes.array,
  listSite: PropTypes.func,
  listStudy: PropTypes.func,
  createStudy: PropTypes.func,
  listAllScanner: PropTypes.func,
  createScanner: PropTypes.func,
  listAllSubject: PropTypes.func,
  createSubject: PropTypes.func,
  listAllSession: PropTypes.func,
  createSession: PropTypes.func,
  listAllSeries: PropTypes.func,
  createSeries: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default connect(
  selectors,
  actions,
)(DefaultFileUploadForm)
