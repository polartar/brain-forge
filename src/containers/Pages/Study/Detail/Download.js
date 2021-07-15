import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Form, Switch, notification } from 'antd'
import axios from 'axios'
import { get } from 'lodash'
import pluralize from 'pluralize'
import { AsyncSelect, Select, Option } from 'components'

const { Item: FormItem } = Form

const Download = ({ study, analysisTypes }) => {
  const [includeData, setIncludeData] = useState(true)
  const [includeResult, setIncludeResult] = useState(false)
  const [subject, setSubject] = useState([])
  const [session, setSession] = useState([])
  const [series, setSeries] = useState([])
  const [analysisType, setAnalysisType] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isGettingInfo, setIsGettingInfo] = useState(false)
  const [downloadInfo, setDownloadInfo] = useState(null)

  useEffect(() => {
    if (includeResult) {
      if (subject.length && session.length && series.length && analysisType.length) {
        getFileDownloadInfo()
      } else {
        setDownloadInfo(null)
      }
    } else if (includeData) {
      if (subject.length && session.length && series.length) {
        getFileDownloadInfo()
      } else {
        setDownloadInfo(null)
      }
    } else {
      setDownloadInfo(null)
    }
  }, [subject, session, series, analysisType])

  useEffect(() => {
    setSession([])
    setSeries([])
  }, [subject])

  useEffect(() => {
    setSeries([])
  }, [session])

  useEffect(() => {
    if (!includeData) {
      setSubject([])
      setSession([])
      setSeries([])
    }

    if (!includeResult) {
      setAnalysisType([])
    }
  }, [includeData, includeResult])

  const totalCount = useMemo(() => {
    if (!downloadInfo) {
      return 0
    }

    return get(downloadInfo, 'datafiles', 0) + get(downloadInfo, 'analyses', 0)
  }, [downloadInfo])

  const message = useMemo(() => {
    if (!downloadInfo) {
      return ''
    }

    const dataFileCount = pluralize('file', get(downloadInfo, 'datafiles', 0), true)
    const analysisResultCount = pluralize('analysis', get(downloadInfo, 'analyses', 0), true)

    if (includeData && includeResult) {
      return `${dataFileCount} and ${analysisResultCount} found.`
    }

    if (includeData) {
      return `${dataFileCount} found.`
    }

    if (includeResult) {
      return `${analysisResultCount} found.`
    }

    return ''
  }, [downloadInfo, includeData, includeResult])

  const showDownloadButton = useMemo(() => {
    if (includeResult) {
      return Boolean(subject.length && session.length && series.length && analysisType.length)
    }

    if (includeData) {
      return Boolean(subject.length && session.length && series.length)
    }

    return false
  }, [subject, session, series, analysisType, includeData, includeResult])

  const dataType = useMemo(() => {
    if (includeData && includeResult) {
      return 'all'
    } else if (includeData) {
      return 'original_data'
    } else if (includeResult) {
      return 'analysis_result'
    }
  }, [includeData, includeResult])

  const getFileDownloadInfo = () => {
    const payload = {
      subject,
      session,
      series,
      analysis_type: analysisType,
    }

    setIsGettingInfo(true)

    axios
      .post(`/study/${study.id}/download-info/`, payload)
      .then(res => {
        setDownloadInfo(res.data)
      })
      .catch(() => {
        notification.error({ message: 'Failed to get information for files.' })
      })
      .finally(() => {
        setIsGettingInfo(false)
      })
  }

  const handleDownload = () => {
    setIsDownloading(true)

    const payload = {
      subject,
      session,
      series,
      analysis_type: analysisType,
      data_type: dataType,
    }

    axios
      .post(`/study/${study.id}/download-data/`, payload)
      .then(() => {
        notification.success({
          message: 'The download is being prepared. We will reach out to you via email once the download is ready.',
        })
      })
      .catch(() => {
        notification.error({ message: 'Failed to get information for files.' })
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }

  const tailFormItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 8, offset: 8 },
    },
  }

  return (
    <div className="min-height-500">
      <div className="app-page__subheading">Download Data</div>
      <div className="w-50">
        {!includeData && !includeResult && (
          <Alert type="info" message="Turn on one of the switches to select data" className="mb-1 text-center" />
        )}
        <div>
          <FormItem label="Include original data" {...formItemLayout}>
            <Switch checked={includeData} onChange={setIncludeData} />
          </FormItem>

          <FormItem label="Include analysis result" {...formItemLayout}>
            <Switch checked={includeResult} onChange={setIncludeResult} />
          </FormItem>

          {(includeData || includeResult) && (
            <>
              <FormItem label="Subject" {...formItemLayout}>
                <AsyncSelect
                  placeholder="Subject"
                  fetchUrl={{ base: '/data-directory-filter/subject/', queryParams: { study: study.id } }}
                  value={subject}
                  disabled={isGettingInfo}
                  mode="multiple"
                  searchByDefault
                  showSelectAll
                  onChange={setSubject}
                />
              </FormItem>

              <FormItem label="Session" {...formItemLayout}>
                <AsyncSelect
                  placeholder="Session"
                  fetchUrl={{
                    base: '/data-directory-filter/session/',
                    queryParams: { subject: subject.join(',') },
                  }}
                  value={session}
                  disabled={isGettingInfo || subject.length === 0}
                  mode="multiple"
                  searchByDefault
                  showSelectAll
                  onChange={setSession}
                />
              </FormItem>

              <FormItem label="Series" {...formItemLayout}>
                <AsyncSelect
                  placeholder="Series"
                  fetchUrl={{
                    base: '/data-directory-filter/series/',
                    queryParams: {
                      uniq: 'on',
                      subject: subject.join(','),
                      session: session.join(','),
                      exclude_result: dataType === 'original_data' ? 'on' : 'off',
                    },
                  }}
                  value={series}
                  disabled={isGettingInfo || session.length === 0}
                  mode="multiple"
                  searchByDefault
                  showSelectAll
                  onChange={setSeries}
                />
              </FormItem>
            </>
          )}

          {includeResult && (
            <FormItem label="Analysis Type" {...formItemLayout}>
              <Select
                placeholder="Analysis Type"
                value={analysisType}
                className="w-100"
                mode="multiple"
                allowClear
                disabled={analysisTypes.length === 0}
                onChange={setAnalysisType}
              >
                {analysisTypes.map(anaysisType => (
                  <Option key={anaysisType.id} value={anaysisType.id}>
                    {anaysisType.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          )}

          {!!downloadInfo && (
            <Alert type={totalCount === 0 ? 'warning' : 'info'} message={message} className="mb-1 text-center" />
          )}

          {showDownloadButton && (
            <FormItem {...tailFormItemLayout}>
              <Button
                type="primary"
                disabled={isDownloading || isGettingInfo || totalCount === 0}
                onClick={handleDownload}
              >
                Download
              </Button>
            </FormItem>
          )}
        </div>
      </div>
    </div>
  )
}

Download.propTypes = {
  analysisTypes: PropTypes.array,
  study: PropTypes.object,
}

export default Download
