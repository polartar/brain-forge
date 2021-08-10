import React, { Fragment, useEffect, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { PropTypes } from 'prop-types'

import Papa from 'papaparse'
import { Form, Table, Icon, Tooltip, Alert } from 'antd'
import { first, filter, each, map, get, uniqBy, isEmpty, isEqual, isArray } from 'lodash'
import { connect } from 'react-redux'

import { MiscFileTree } from 'components'
import { createStructuredSelector } from 'reselect'
import { selectAnalysis, selectAnalysisOptions, setAnalysisOption } from 'store/modules/analyses'
import { getMetadata, selectMetadata, selectDataFilesStatus } from 'store/modules/datafiles'
import { failAction, successAction } from 'utils/state-helpers'
import { selectUploadableStudies } from 'store/modules/sites'
import { GET_METADATA } from 'store/modules/datafiles/actions'

const { Item: FormItem } = Form
const MAX_NUM_FILTER_OPTIONS = 10

export const MetadataEditor = props => {
  const { analysisOptions, allowedHeaders, metadata, dataFilesStatus } = props

  const selectedMetadata = get(analysisOptions, 'Metadata.value')

  const [metadataValue, setMetadataValue] = useState([])
  const [metaErrors, setMetaErrors] = useState([])
  const [tableColumns, setTableColumns] = useState([])
  const [existMetadata, setExistMetadata] = useState(false)

  useEffect(() => {
    const selectedMetadata = get(analysisOptions, 'Metadata.value')

    if (selectedMetadata) {
      handleMiscFileChange(selectedMetadata)
    }
  }, [])

  useEffect(() => {
    if (dataFilesStatus === successAction(GET_METADATA)) {
      unstable_batchedUpdates(() => {
        setMetaErrors([])
        setExistMetadata(true)
      })
    } else if (dataFilesStatus === failAction(GET_METADATA)) {
      unstable_batchedUpdates(() => {
        setMetaErrors('Failed to load CSV file')
        setExistMetadata(false)
      })
    }
  }, [dataFilesStatus])

  useEffect(() => {
    if (existMetadata) {
      initMetadataTable()
    } else {
      props.onChange({ result: [], tableColumns: [] })
    }
  }, [existMetadata])

  const initMetadataTable = () => {
    const papaOptions = {
      skipEmptyLines: true,
      header: true,
      delimiter: '',
    }

    if (isEmpty(metadata)) return

    const papaRes = Papa.parse(metadata, papaOptions)

    let metaErrors = papaRes.errors

    // Skip metadata rows that contains errors.
    each(metaErrors, error => !isEmpty(error.row) && (papaRes.data[error.row]['error'] = error))
    const parsedMetadata = filter(papaRes.data, row => !row.error)

    const columns = papaRes.meta.fields

    // Generate table columns with filter.
    const tableColumns = map(columns, key => {
      const uniqValues = uniqBy(parsedMetadata, key)
      // Note: only columns with small number of distinct values will be used as filters.
      const colFilters =
        uniqValues.length < MAX_NUM_FILTER_OPTIONS
          ? map(uniqValues, val => ({ text: get(val, key), value: get(val, key) }))
          : []

      return {
        title: (
          <Fragment>
            {key} {allowedHeaders && !allowedHeaders.includes(key) && <Icon type="warning" />}
          </Fragment>
        ),
        dataIndex: key,
        key: key,
        filters: colFilters,
        onFilter: (value, record) => get(record, key).indexOf(value) === 0,
      }
    })

    unstable_batchedUpdates(() => {
      setMetadataValue(parsedMetadata)
      setMetaErrors(metaErrors)
      setTableColumns(tableColumns)
    })

    props.onChange({
      rows: parsedMetadata,
      tableColumns,
    })
  }

  const handleSetOption = (optionName, parameterName, value) => {
    props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  const handleMiscFileChange = files => {
    const option = first(files)
    handleSetOption('Metadata', 'value', option)

    unstable_batchedUpdates(() => {
      setTableColumns(null)
      setExistMetadata(false)
      setMetaErrors([])
    })

    const filePath = get(option, 'path')
    props.getMetadata(filePath)
    props.onFileChange(files)
  }

  const keyColumns = map(tableColumns, 'key')

  return (
    <Fragment>
      <FormItem label="Select a Metadata file (optional)">
        <MiscFileTree initialValue={get(selectedMetadata, 'id')} onChange={handleMiscFileChange} />
      </FormItem>

      {!isEmpty(metaErrors) && (
        <FormItem>
          <Alert type="error" message={isArray(metaErrors) ? JSON.stringify(metaErrors, null, 2) : metaErrors} />
        </FormItem>
      )}

      {existMetadata && (
        <FormItem
          colon={false}
          label={
            <span>
              Metadata Table:{' '}
              {allowedHeaders && !isEqual(keyColumns, allowedHeaders) && (
                <Tooltip placement="rightTop" title={`Only these columns are allowed: ${allowedHeaders.join(', ')}`}>
                  <Icon style={{ fontSize: '16px', color: '#ffcf6f' }} type="warning" />
                </Tooltip>
              )}
            </span>
          }
        >
          <Table
            rowKey="uid"
            scroll={{ x: '100%' }}
            pagination={{ pageSize: 5 }}
            columns={tableColumns}
            dataSource={metadataValue}
            size="small"
          />
        </FormItem>
      )}
    </Fragment>
  )
}

const selectors = createStructuredSelector({
  analysis: selectAnalysis,
  analysisOptions: selectAnalysisOptions,
  studies: selectUploadableStudies,
  metadata: selectMetadata,
  dataFilesStatus: selectDataFilesStatus,
})

const actions = {
  setAnalysisOption,
  getMetadata,
}

MetadataEditor.propTypes = {
  analysisOptions: PropTypes.object,
  allowedHeaders: PropTypes.array,
  studies: PropTypes.array,
  readOnly: PropTypes.bool,
  metadata: PropTypes.string,
  dataFilesStatus: PropTypes.string,
  getMetadata: PropTypes.func,
  setAnalysisOption: PropTypes.func,
  onChange: PropTypes.func,
  onFileChange: PropTypes.func,
}

MetadataEditor.defaultProps = {
  readOnly: false,
  allowedHeaders: null,
  onChange: () => {},
  onFileChange: () => {},
}

export default connect(
  selectors,
  actions,
)(MetadataEditor)