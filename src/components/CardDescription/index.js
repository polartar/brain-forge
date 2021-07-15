import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { Tag } from 'antd'
import { map } from 'lodash'
import { TAG_COLORS } from 'config/base'

export class CardDescription extends Component {
  static propTypes = {
    baseUrl: PropTypes.string,
    description: PropTypes.string,
    history: PropTypes.object,
    sets: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    ),
  }

  handleTagClick = id => {
    const { baseUrl } = this.props
    this.props.history.push(`${baseUrl}/${id}`)
  }

  render() {
    const { description, sets } = this.props

    if (sets.length === 0) {
      return description
    }

    return (
      <div>
        <div className={{ marginBottom: 10 }}>{description}</div>
        <div>
          {map(sets, ({ id, name }, ind) => (
            <Tag key={id} color={TAG_COLORS[ind]} style={{ marginTop: 5 }} onClick={() => this.handleTagClick(id)}>
              {name}
            </Tag>
          ))}
        </div>
      </div>
    )
  }
}

export default compose(withRouter)(CardDescription)
