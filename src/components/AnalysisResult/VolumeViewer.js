import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, TreeSelect } from 'antd'
import { filter, get, isEmpty, uniq } from 'lodash'
import { encodePathURL } from 'utils/analyses'
import { PapayaViewer } from 'components'
import { getAuthData } from 'utils/storage'
import FileTreeBuilder from 'utils/file-tree-builder'

export default class VolumeViewer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      has_figures: PropTypes.bool,
      all_files: PropTypes.array,
      out_dir: PropTypes.string,
      save_path: PropTypes.string,
    }),
  }

  state = {
    papayaFile: null,
  }

  render() {
    const { data } = this.props
    const { all_files, out_dir, save_path } = data
    const { papayaFile } = this.state
    const outDir = out_dir || save_path

    const niiFiles = filter(all_files, file => file.endsWith('.nii'))
    const uniqNiis = uniq(niiFiles)

    if (isEmpty(uniqNiis)) {
      return null
    }

    const builder = new FileTreeBuilder()
    const treeData = builder.run(uniqNiis)
    const authData = getAuthData()
    const token = get(authData, 'token')

    return (
      <Fragment>
        <TreeSelect
          style={{ minWidth: '600px' }}
          value={papayaFile}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="Please select"
          treeDefaultExpandAll
          onChange={value => this.setState({ papayaFile: value })}
        />

        {papayaFile && (
          <Fragment>
            <Divider />
            <PapayaViewer file={encodePathURL(outDir, papayaFile, token)} />
          </Fragment>
        )}
      </Fragment>
    )
  }
}
