import React from 'react'
import PropTypes from 'prop-types'
import { PAPAYA_URL } from 'config/base'

const PapayaViewer = ({ file, width, height, title }) =>
  file && (
    <iframe
      title={title || 'Papaya'}
      width={width || '100%'}
      height={height || '800px'}
      src={`${PAPAYA_URL}?file=${file}`}
    />
  )

PapayaViewer.propTypes = {
  file: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  title: PropTypes.string,
}

export default PapayaViewer
