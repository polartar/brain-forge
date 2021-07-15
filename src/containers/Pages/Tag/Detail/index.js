import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Card, Descriptions, Tag } from 'antd'
import { getTag, selectTag, selectSitesStatus, GET_TAG } from 'store/modules/sites'
import { PageLayout } from 'containers/Layouts'
import { Loader } from 'components'

const { Item } = Descriptions

export class TagDetailPage extends Component {
  static propTypes = {
    tag: PropTypes.object,
    match: PropTypes.object,
    status: PropTypes.string,
    getTag: PropTypes.func,
  }

  componentWillMount() {
    const { match } = this.props

    this.props.getTag(match.params.tagId)
  }

  get loading() {
    const { status } = this.props

    return status === GET_TAG
  }

  renderElements = (elemName, elems) => {
    if (elems.length === 0) {
      return `No ${elemName}`
    }

    return elems.map(elem => (
      <Tag key={elem.id} className="my-02">
        {elem.name}
      </Tag>
    ))
  }

  render() {
    const { tag } = this.props

    if (this.loading) {
      return <Loader />
    }

    if (!tag) {
      return null
    }

    const { label, color, studies, subjects, sessions } = tag

    return (
      <PageLayout heading={label}>
        <Card>
          <div className="w-75">
            <Descriptions bordered column={1} size="small">
              <Item label="Label">
                <Tag color={color}>{label}</Tag>
              </Item>
              <Item label="Studies">{this.renderElements('study', studies)}</Item>
              <Item label="Subjects">{this.renderElements('subject', subjects)}</Item>
              <Item label="Sessions">{this.renderElements('session', sessions)}</Item>
            </Descriptions>
          </div>
        </Card>
      </PageLayout>
    )
  }
}

const selectors = createStructuredSelector({
  tag: selectTag,
  status: selectSitesStatus,
})

const actions = {
  getTag,
}

export default connect(
  selectors,
  actions,
)(TagDetailPage)
