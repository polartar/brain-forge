import React, { Fragment } from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { find, get } from 'lodash'
import { Descriptions, Tooltip } from 'antd'

import { CheckIcon } from 'components'
import { PageLayout } from 'containers/Layouts'
import { USER_ROLES } from 'config/base'

const { Item } = Descriptions

export const UserProfilePage = props => {
  const { user } = props

  const renderBoolean = value => (value ? 'Yes' : 'No')

  const renderDate = (label, date) => date && <Item label={label}>{moment(date).format('MM/DD/YYYY HH:mm')}</Item>

  const userRole = find(USER_ROLES, { value: user.role })

  return user ? (
    <PageLayout>
      <Descriptions bordered column={1} size="small">
        <Item label="First name">{user.first_name}</Item>
        <Item label="Last name">{user.last_name}</Item>
        <Item label="Username">{user.username}</Item>
        <Item label="Email">
          {user.email && (
            <Fragment>
              {user.email}
              <Tooltip
                placement="top"
                title={`${user.email_verified ? 'Email is verified' : 'Please verify your email'}`}
              >
                <span style={{ marginLeft: 5, width: 20 }}>
                  <CheckIcon checked={user.email_verified} />
                </span>
              </Tooltip>
            </Fragment>
          )}
        </Item>
        <Item label="Authenticated">{renderBoolean(user.is_authenticated)}</Item>
        <Item label="Active">{renderBoolean(user.is_active)}</Item>
        <Item label="Managed">{renderBoolean(user.is_managed)}</Item>
        <Item label="Staff">{renderBoolean(user.is_staff)}</Item>
        <Item label="SuperUser">{renderBoolean(user.is_superuser)}</Item>
        {renderDate('Last Login', user.last_login)}
        {renderDate('Date Joined', user.date_joined)}
        {user.site && <Item label="Site">{user.site}</Item>}
        {user.role && <Item label="Role">{get(userRole, 'text')}</Item>}
        {user.site_role && <Item label="Site Role">{user.site_role}</Item>}
      </Descriptions>
    </PageLayout>
  ) : (
    <></>
  )
}

UserProfilePage.propTypes = {
  user: PropTypes.object,
}

export default UserProfilePage
