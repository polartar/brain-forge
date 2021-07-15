import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Col, Row } from 'antd'

const PageLayout = ({ heading, subheading, children }) => (
  <div className="app-page">
    <Row>
      {heading && (
        <Col>
          <div className="app-page__heading">{heading}</div>
          {subheading && <div className="app-page__subheading-width-limit">{subheading}</div>}
        </Col>
      )}
      <Col>
        <div className={cx('app-page__content', { 'pt-0': !heading })}>{children}</div>
      </Col>
    </Row>
  </div>
)

PageLayout.propTypes = {
  heading: PropTypes.any,
  subheading: PropTypes.any,
  children: PropTypes.node,
}

export default PageLayout
