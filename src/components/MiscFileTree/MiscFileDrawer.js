import React, { useState } from 'react'
import PropsType from 'prop-types'
import { Button, Drawer } from 'antd'
import { MiscFileForm } from 'components'

export const MiscFile = props => {
  const { disabled } = props

  const [showDrawer, setShowDrawer] = useState(false)

  const addBtnStyle = {
    style: { marginLeft: 10 },
    type: 'primary',
    shape: 'circle',
    icon: 'plus',
    size: 'small',
  }

  return (
    <>
      <Button
        {...addBtnStyle}
        disabled={disabled}
        className="misc-file-add-btn"
        onClick={() => setShowDrawer(!showDrawer)}
      />
      <Drawer
        width={400}
        title="Upload miscellaneous file"
        visible={showDrawer}
        onClose={() => setShowDrawer(!showDrawer)}
      >
        <MiscFileForm onSubmit={() => setShowDrawer(!showDrawer)} />
      </Drawer>
    </>
  )
}

MiscFile.propTypes = {
  disabled: PropsType.bool,
}

MiscFile.defaultProps = {
  disabled: false,
}

export default MiscFile
