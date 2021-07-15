import React, { useState, Fragment, useEffect } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { createStructuredSelector } from 'reselect'
import { Button, Form, Input, Upload, Icon } from 'antd'
import { selectLoggedInUser } from 'store/modules/auth'
import { listSite, listStudy, createStudy, selectSites, selectStudies, CREATE_STUDY } from 'store/modules/sites'
import { uploadMiscFiles, UPLOAD_MISC_FILES } from 'store/modules/datafiles'
import { Drawer, Option, StudyForm, Select } from 'components'
import { successAction } from 'utils/state-helpers'

const { Item: FormItem } = Form

export const MiscFileUpload = props => {
  const { dataFileStatus, user, studies, status, sites } = props

  const [study, setStudy] = useState()
  const [description, setDescription] = useState('')
  const [upload, setUpload] = useState(null)
  const [showStudyDrawer, setShowStudyDrawer] = useState(false)

  useEffect(() => {
    props.listStudy()
    props.listSite()
  }, [])

  useEffect(() => {
    if (dataFileStatus === successAction(UPLOAD_MISC_FILES)) {
      unstable_batchedUpdates(() => {
        setStudy()
        setDescription('')
        setUpload(null)
        setShowStudyDrawer(false)
      })
      props.onLoadMiscFile()
    }
  }, [dataFileStatus])

  const handleFileChange = fileList => {
    setUpload(fileList)
  }

  const handleStudySubmit = ({ data }) => {
    props.createStudy(data)
  }

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
      <FormItem {...formItemLayout} label="Study" validateStatus={study ? 'success' : 'error'}>
        <div style={wrapperStyle}>
          <Select className="w-100" value={study} onChange={value => setStudy(value)}>
            {studies.map(({ id, full_name }) => (
              <Option key={id} value={id}>
                {full_name}
              </Option>
            ))}
          </Select>
          <Button {...addBtnStyle} className="study-add-btn" onClick={() => setShowStudyDrawer(!showStudyDrawer)} />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="Description">
        <div style={wrapperStyle}>
          <Input
            className="input-description"
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label="File">
        <Upload
          name="upload"
          className="w-100 select-upload"
          fileList={get(upload, 'fileList')}
          onChange={handleFileChange}
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
          disabled={!study || !upload}
          loading={dataFileStatus === UPLOAD_MISC_FILES}
          onClick={handleUploadMiscFileSubmit}
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
    </Fragment>
  )
}

const selectors = createStructuredSelector({
  sites: selectSites,
  studies: selectStudies,
  user: selectLoggedInUser,
})

const actions = {
  listSite,
  listStudy,
  createStudy,
  uploadMiscFiles,
}

MiscFileUpload.propTypes = {
  sites: PropTypes.array,
  user: PropTypes.object,
  studies: PropTypes.array,
  status: PropTypes.string,
  dataFileStatus: PropTypes.string,
  createStudy: PropTypes.func,
  listSite: PropTypes.func,
  listStudy: PropTypes.func,
  uploadMiscFiles: PropTypes.func,
  onLoadMiscFile: PropTypes.func,
  onSubmit: PropTypes.func,
}

export default connect(
  selectors,
  actions,
)(MiscFileUpload)
