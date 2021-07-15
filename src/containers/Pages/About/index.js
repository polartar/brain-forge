import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card } from 'antd'
import { selectVersion } from 'store/modules/auth'
import { PageLayout } from 'containers/Layouts'

export const About = ({ version }) => (
  <PageLayout heading="Version">
    <Card>
      <h5 className="app-page__subheading">{version}</h5>
    </Card>
  </PageLayout>
)

const selectors = createStructuredSelector({
  version: selectVersion,
})

About.propTypes = {
  version: PropTypes.string,
}

export default connect(selectors)(About)
