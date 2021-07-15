import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { find, filter, map, isEmpty } from 'lodash'
import { TreeSelect } from 'antd'

import { createStructuredSelector } from 'reselect'
import { listMiscFile, selectMiscFile } from 'store/modules/datafiles'
import MiscFileDrawer from './MiscFileDrawer'

export const MiscFileTree = props => {
  const { multiple, disabled, initialValue, miscFile, listMiscFile } = props

  const [treeData, setTreeData] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])

  useEffect(() => {
    listMiscFile()

    if (initialValue) {
      setSelectedKeys(`file;${initialValue}`)
    }
  }, [])

  useEffect(() => {
    createDataFileNodes()
  }, [miscFile])

  const createDataFileNodes = () => {
    let newTreeData = [...treeData]

    if (!isEmpty(miscFile)) {
      miscFile.forEach(miscItem => {
        // Create node Study.
        const parentNode = createNode(newTreeData, 'study', miscItem.study, null)

        // Create node misc file.
        createNode(newTreeData, 'file', miscItem, parentNode.id)
      })
    }

    setTreeData(newTreeData)
  }

  const createNode = (treeData, fieldToLoad, elem, parentId) => {
    if (!elem) return null

    const elemId = `${fieldToLoad};${elem.id}`
    const existedNode = find(treeData, { id: elemId })

    if (existedNode) return existedNode

    const isLeaf = fieldToLoad === 'file'
    const node = {
      id: elemId,
      title: elem.full_name || elem.file,
      pId: parentId,
      value: elem.value || elemId,
      field: fieldToLoad,
      isLeaf: isLeaf,
      selectable: isLeaf,
      elem,
    }

    treeData.push(node)
    return node
  }

  const handleChange = (value, _, extra) => {
    const selectedNodes = map([value], id => find(treeData, { id }))
    const selectedLeafNodes = filter(selectedNodes, 'isLeaf')
    const selectedFiles = map(selectedLeafNodes, 'elem')

    setSelectedKeys(map(selectedLeafNodes, 'id'))
    props.onChange(selectedFiles)
  }

  return (
    <>
      <TreeSelect
        treeDataSimpleMode
        value={selectedKeys}
        treeCheckable={multiple}
        disabled={disabled}
        style={{ width: '94%', margin: '0 auto' }}
        placeholder="Please select"
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        onChange={handleChange}
      />
      <MiscFileDrawer disabled={disabled} />
    </>
  )
}

const selectors = createStructuredSelector({
  miscFile: selectMiscFile,
})

const actions = {
  listMiscFile,
}

const inputFileShape = PropTypes.shape({
  created_at: PropTypes.string,
  id: PropTypes.number,
  files: PropTypes.string,
})

MiscFileTree.propTypes = {
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  miscFile: PropTypes.array,
  initialValue: PropTypes.oneOfType([PropTypes.number, inputFileShape]),
  listMiscFile: PropTypes.func,
  onChange: PropTypes.func,
}

MiscFileTree.defaultProps = {
  multiple: false,
}

export default connect(
  selectors,
  actions,
)(MiscFileTree)
