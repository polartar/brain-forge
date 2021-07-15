import React, { useState } from 'react'
import { Card, Switch } from 'antd'
import { PageLayout } from 'containers/Layouts'

import UserTable from './UserTable'

export const UserPage = () => {
  const [editable, setEditable] = useState(false)

  return (
    <PageLayout heading="Users">
      <Card>
        <div style={{ marginBottom: 20, textAlign: 'right' }}>
          <Switch
            checkedChildren="Edit"
            unCheckedChildren="Edit"
            checked={editable}
            onChange={() => setEditable(!editable)}
          />
        </div>
        <UserTable editable={editable} />
      </Card>
    </PageLayout>
  )
}

export default UserPage
