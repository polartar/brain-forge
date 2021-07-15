import React, { Fragment, useEffect, useState } from 'react'
import { PropTypes } from 'prop-types'
import Papa from 'papaparse'
import { Form, Table, Radio, Alert } from 'antd'
import { concat, first, filter, each, map, get, times, uniqBy, size, zipObject, isEmpty, isArray } from 'lodash'
import { connect } from 'react-redux'
import { MiscFileTree } from 'components'
import { createStructuredSelector } from 'reselect'
import { selectAnalysis, selectAnalysisOptions, setAnalysisOption } from 'store/modules/analyses'
import { getMetadata, selectMetadata, selectDataFilesStatus, setCurrentFiles } from 'store/modules/datafiles'
import { failAction, successAction } from 'utils/state-helpers'
import { selectUploadableStudies } from 'store/modules/sites'
import { GET_METADATA } from 'store/modules/datafiles/actions'

const { Item: FormItem } = Form
const MAX_NUM_FILTER_OPTIONS = 10

export const MetadataEditor = props => {
  const { analysisOptions, metadata, dataFilesStatus, readOnly } = props

  const selectedMetadata = get(analysisOptions, 'Metadata.value')

  const [metaHeader, setMetaHeader] = useState(true)
  const [metaDelimiter, setMetaDelimiter] = useState('')
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
      setExistMetadata(true)
      setMetaErrors([])
    } else if (dataFilesStatus === failAction(GET_METADATA)) {
      setExistMetadata(false)
      setMetaErrors('Failed to load CSV file')
    }
  }, [dataFilesStatus])

  useEffect(() => {
    if (existMetadata) {
      initMetadataTable()
    } else {
      props.onChange({ result: [], tableColumns: [] })
    }
  }, [existMetadata, metaHeader, metaDelimiter])

  const initMetadataTable = () => {
    let columns = []
    let parsedMetadata = []
    const papaOptions = {
      skipEmptyLines: true,
      header: metaHeader,
      delimiter: metaDelimiter,
    }

    if (isEmpty(metadata)) return

    const papaRes = Papa.parse(metadata, papaOptions)

    let metaErrors = papaRes.errors

    // Skip metadata rows that contains errors.
    each(metaErrors, error => !isEmpty(error.row) && (papaRes.data[error.row]['error'] = error))
    parsedMetadata = filter(papaRes.data, row => !row.error)

    if (metaHeader) {
      // If the first row is the column header, use papa parsed meta for this.
      columns = papaRes.meta.fields
    } else {
      // Otherwise, create a list of column headers: col_1, col_2 ...
      columns = times(size(first(parsedMetadata)), index => `col_${index}`)

      // Search for errors in row with missing columns.
      const errors = filter(
        map(
          parsedMetadata,
          (row, index) =>
            columns.length !== row.length && {
              code: 'TooFewFields',
              message: `Too few fields: expected ${columns.length} fields but parsed ${row.length}`,
              row: index,
              type: 'FieldMismatch',
            },
        ),
      )
      // Combine errors with Papaparse.
      metaErrors = concat(metaErrors, errors)
      // Exclude row that is missing columns.
      parsedMetadata = filter(parsedMetadata, row => columns.length === row.length)
      // Create a list of dict with keys from indexed columns and values from row.
      parsedMetadata = map(parsedMetadata, row => zipObject(columns, row))
    }

    // Generate table columns with filter.
    const tableColumns = map(columns, key => {
      const uniqValues = uniqBy(parsedMetadata, key)
      // Note: only columns with small number of distinct values will be used as filters.
      const colFilters =
        uniqValues.length < MAX_NUM_FILTER_OPTIONS
          ? map(uniqValues, val => ({ text: get(val, key), value: get(val, key) }))
          : []
      return {
        title: key,
        dataIndex: key,
        key: key,
        filters: colFilters,
        onFilter: (value, record) => get(record, key).indexOf(value) === 0,
      }
    })

    setMetadataValue(parsedMetadata)
    setMetaErrors(metaErrors)
    setTableColumns(tableColumns)

    props.onChange({
      result: parsedMetadata,
      tableColumns,
    })
  }

  const handleSetOption = (optionName, parameterName, value) => {
    props.setAnalysisOption({ name: optionName, option: { [parameterName]: value } })
  }

  const handleMiscFileChange = data => {
    handleSetOption('Metadata', 'value', data)
    setTableColumns(null)
    setExistMetadata(false)
    setMetaErrors([])

    const filePath = get(data, 'path')

    props.getMetadata(filePath)
  }

  return (
    <Fragment>
      <FormItem label="Select a Metadata file (optional)" style={{ fontSize: 18 }}>
        <MiscFileTree initialValue={get(selectedMetadata, 'id')} onChange={data => handleMiscFileChange(first(data))} />
      </FormItem>

      {!isEmpty(metaErrors) && (
        <FormItem>
          <Alert type="error" message={isArray(metaErrors) ? JSON.stringify(metaErrors, null, 2) : metaErrors} />
        </FormItem>
      )}

      {existMetadata && (
        <Fragment>
          <FormItem label="Please choose header mode">
            <Radio.Group disabled={readOnly} onChange={e => setMetaHeader(e.target.value)} value={metaHeader}>
              <Radio value={true}>First row header</Radio>
              <Radio value={false}>No header row</Radio>
            </Radio.Group>
          </FormItem>
          <FormItem label="Please choose separation character">
            <Radio.Group value={metaDelimiter} disabled={readOnly} onChange={e => setMetaDelimiter(e.target.value)}>
              <Radio key="1" value="">
                Auto-detect Delimiter
              </Radio>
              <Radio key="2" value=",">
                Comma
              </Radio>
              <Radio key="3" value=" ">
                Space
              </Radio>
              <Radio key="4" value="\t">
                Tab
              </Radio>
            </Radio.Group>
          </FormItem>
        </Fragment>
      )}

      {existMetadata && (
        <Fragment>
          <FormItem label="Metadata Table:">
            <Table
              rowKey="uid"
              pagination={{ pageSize: 5 }}
              columns={tableColumns}
              dataSource={metadataValue}
              size="small"
            />
          </FormItem>
        </Fragment>
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
  setCurrentFiles,
}

MetadataEditor.propTypes = {
  analysisOptions: PropTypes.object,
  studies: PropTypes.array,
  readOnly: PropTypes.bool,
  metadata: PropTypes.string,
  dataFilesStatus: PropTypes.string,
  getMetadata: PropTypes.func,
  setAnalysisOption: PropTypes.func,
  onChange: PropTypes.func,
}

MetadataEditor.defaultProps = {
  readOnly: false,
  onChange: () => {},
}

export default connect(
  selectors,
  actions,
)(MetadataEditor)
