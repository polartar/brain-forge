import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Button, Form, Input, Icon, Upload } from 'antd'
import { listStudy, selectStudies } from 'store/modules/sites'
import { selectDataFilesStatus, uploadMiscFiles, listMiscFile, UPLOAD_MISC_FILES } from 'store/modules/datafiles'
import { successAction } from 'utils/state-helpers'
import { Select, Option } from 'components'

const { Item: FormItem } = Form

export const MiscFileForm = props => {
  const { dataFileStatus, studies } = props

  const [study, setStudy] = useState()
  const [description, setDescription] = useState()
  const [upload, setUpload] = useState()

  useEffect(() => {
    props.listStudy()
  }, [])

  useEffect(() => {
    if (dataFileStatus === successAction(UPLOAD_MISC_FILES)) {
      props.onSubmit()
      props.listMiscFile()
    }
  }, [dataFileStatus])

  const handleUploadMiscFileSubmit = () => {
    const formData = new FormData()

    // FormData append params
    formData.append('study', study)
    formData.append('description', description)
    upload.fileList.forEach(file => {
      formData.append('file', file.originFileObj)
    })

    props.uploadMiscFiles(formData)
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  }

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    height: 40,
  }

  const tailFormItemLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 18, offset: 6 },
    },
  }

  return (
    <Form {...formItemLayout}>
      <FormItem {...formItemLayout} label="Study" validateStatus={study ? 'success' : 'error'}>
        <div style={wrapperStyle}>
          <Select className="w-100" value={study} onChange={value => setStudy(value)}>
            {studies.map(({ id, full_name }) => (
              <Option key={id} value={id}>
                {full_name}
              </Option>
            ))}
          </Select>
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="Description">
        <div style={wrapperStyle}>
          <Input onChange={event => setDescription(event.target.value)} />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="File">
        <Upload name="upload" className="w-100" onChange={data => setUpload(data)} beforeUpload={() => false}>
          <Button className="w-100">
            <Icon type="upload" /> File
          </Button>
        </Upload>
      </FormItem>

      <FormItem {...tailFormItemLayout}>
        <Button
          className="upload-btn w-100"
          type="primary"
          disabled={!study || !upload}
          loading={dataFileStatus === UPLOAD_MISC_FILES}
          onClick={handleUploadMiscFileSubmit}
        >
          Upload
        </Button>
      </FormItem>
    </Form>
  )
}

const selectors = createStructuredSelector({
  studies: selectStudies,
  dataFileStatus: selectDataFilesStatus,
})

const actions = {
  listStudy,
  uploadMiscFiles,
  listMiscFile,
}

MiscFileForm.propTypes = {
  studies: PropTypes.array,
  dataFileStatus: PropTypes.string,
  listStudy: PropTypes.func,
  uploadMiscFiles: PropTypes.func,
  listMiscFile: PropTypes.func,
  onSubmit: PropTypes.func,
}

MiscFileForm.defaultProps = {
  onSubmit: () => {},
}

export default connect(
  selectors,
  actions,
)(MiscFileForm)
