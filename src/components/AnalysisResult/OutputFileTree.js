import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tree } from 'antd'
import { isEmpty } from 'lodash'
import FileTreeBuilder from 'utils/file-tree-builder'

const { DirectoryTree } = Tree

export default class OutputFileTree extends Component {
  static propTypes = {
    files: PropTypes.array,
  }

  buildTree = files => {
    const builder = new FileTreeBuilder()

    return builder.run(files)
  }

  render() {
    const { files } = this.props

    if (isEmpty(files)) {
      return null
    }

    const treeData = this.buildTree(files)

    return <DirectoryTree multiple treeData={treeData} />
  }
}
