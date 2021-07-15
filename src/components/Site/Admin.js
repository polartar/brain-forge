import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Empty } from 'antd'
import { get, find } from 'lodash'
import { SET_ADMIN } from 'store/modules/sites'
import { Select, Option } from 'components'

export default class SiteAdmin extends Component {
  static propTypes = {
    site: PropTypes.object,
    status: PropTypes.string,
    setAdmin: PropTypes.func, // eslint-disable-line
  }

  handleChange = userId => {
    const comp = this
    const { id, members } = this.props.site
    const member = find(members, member => member.id === userId)

    Modal.confirm({
      title: `Are you going to promote ${member.username} as site admin?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        /* istanbul ignore next */
        comp.props.setAdmin({ siteId: id, userId: member.id })
      },
    })
  }

  get settingAdmin() {
    const { status } = this.props
    return status === SET_ADMIN
  }

  render() {
    const { members } = this.props.site
    const admin = get(find(members, { site_role: 'Admin' }), 'id')

    return (
      <div className="text-center">
        <h2 className="mb-2">Admin</h2>
        {members.length > 0 ? (
          <Select style={{ width: 150 }} value={admin} onChange={this.handleChange} loading={this.settingAdmin}>
            {members.map(member => (
              <Option key={member.id} value={member.id}>
                {member.username}
              </Option>
            ))}
          </Select>
        ) : (
          <Empty description="Please Add Members" />
        )}
      </div>
    )
  }
}
