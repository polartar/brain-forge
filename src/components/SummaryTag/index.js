import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { kebabCase } from 'lodash'

const SummaryTag = ({ tag, id }) => {
  const tagElement = <div className={cx(`summary-tag ${kebabCase(tag)}`, { button: !!id })}>{tag}</div>

  if (!id) {
    return tagElement
  }

  return <Link to={`/analysis/${id}/result`}>{tagElement}</Link>
}

SummaryTag.propTypes = {
  tag: PropTypes.string,
  id: PropTypes.number,
}

export default SummaryTag
