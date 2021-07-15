import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import Highlighter from 'react-highlight-words'
import { first, get, isEmpty } from 'lodash'
import { Button, Drawer, Dropdown, Menu, Modal, Icon, Input, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { withSizes } from 'react-sizes'

import { BOOL_FILTERS, SITE_ROLES } from 'config/base'
import UserProfile from 'containers/Pages/User/Profile'
import { BREAKPOINTS } from 'config/base'

import EditTableCell from './EditTableCell'
import SetPasswordForm from './SetPasswordForm'

const { Item: MenuItem } = Menu

const CONFIRM_SUPERUSER = {
  PROMOTION:
    'Are you sure you want to promote this user to SuperUser? This user will have the highest permissions for all sites and studies.',
  DEMOTION:
    'Are you sure you want to demote this user from SuperUser? This user will no longer have control over all sites.',
}

export const UserTable = props => {
  const { editable, isNotDesktop } = props

  const [passwordModal, setPasswordModal] = useState(false)
  const [userSelected, setUserSelected] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)

  const listUser = () => {
    setLoading(true)
    axios.get(`/auth/user/`).then(res => {
      const dataUser = get(res, 'data')
      setUsers(dataUser)
      setLoading(false)
    })
  }

  useEffect(() => {
    listUser()
  }, [])

  const handleConfirmSuperUser = record => {
    Modal.confirm({
      title: record.is_superuser ? CONFIRM_SUPERUSER.DEMOTION : CONFIRM_SUPERUSER.PROMOTION,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        handleEditValue(record, 'is_superuser', !record.is_superuser)
      },
    })
  }

  const userTableDropdown = record => {
    const menu = (
      <Menu>
        <MenuItem>
          <Button id="set-password" icon="lock" size="small" type="link" onClick={() => handleSetPassword(record)}>
            Set Password
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            id="user-active"
            icon={record && record.is_active ? 'close-circle' : 'check-circle'}
            size="small"
            type="link"
            onClick={() => handleEditValue(record, 'is_active', !record.is_active)}
          >
            {record && record.is_active ? 'Deactivate User' : 'Activate User'}
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            id="super-user"
            size="small"
            icon={record && record.is_superuser ? 'arrow-down' : 'arrow-up'}
            type="link"
            onClick={() => handleConfirmSuperUser(record)}
          >
            {record && record.is_superuser ? 'Demote SuperUser' : 'Promote SuperUser'}
          </Button>
        </MenuItem>
      </Menu>
    )

    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button id="action-btn" size="small" onClick={e => e.preventDefault()}>
          Action
          <Icon type="down" />
        </Button>
      </Dropdown>
    )
  }

  const userValueBoolean = value => (value ? 'Yes' : 'No')

  const renderTitle = name => (
    <div>
      {name}&nbsp;
      {editable && <Icon id="edit-icon" type="edit" />}
    </div>
  )

  const handleSetPassword = record => {
    setUserSelected(record)
    setPasswordModal(true)
  }

  const handleEditValue = (record, column, value) => {
    if (!isEmpty(record, 'id')) {
      axios.patch(`/auth/user/${record.id}/`, { [column]: value }).then(() => listUser())
    }
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText(first(selectedKeys))
    setSearchedColumn(dataIndex)
  }

  const handleSearchReset = clearFilters => {
    clearFilters()
    setSearchText('')
  }

  const handleOpenProfile = record => {
    setUser(record)
    setShowDrawer(true)
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            node && node.focus()
          }}
          className="searchTxt"
          placeholder={`Search ${dataIndex}`}
          value={first(selectedKeys)}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          name="searchBtn"
          className="searchBtn"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon="searchoutlined"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button name="resetBtn" onClick={() => handleSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  })

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      fixed: isNotDesktop && 'left',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      fixed: isNotDesktop && 'left',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.username.localeCompare(b.username),
      ...getColumnSearchProps('username'),
      render: (_, record) => (
        <Button style={{ padding: 0 }} type="link" onClick={() => handleOpenProfile(record)}>
          {record.username}
        </Button>
      ),
    },
    {
      title: renderTitle('Email'),
      dataIndex: 'email',
      key: 'email',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.email.localeCompare(b.email),
      ...getColumnSearchProps('email'),
      render: (_, record) =>
        record && (
          <EditTableCell
            editable={editable}
            value={record.email}
            onChange={value => handleEditValue(record, 'email', value)}
          />
        ),
    },
    {
      title: renderTitle('First Name'),
      dataIndex: 'first_name',
      key: 'first_name',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      ...getColumnSearchProps('first_name'),
      render: (_, record) =>
        record && (
          <EditTableCell
            editable={editable}
            value={record.first_name}
            onChange={value => handleEditValue(record, 'first_name', value)}
          />
        ),
    },
    {
      title: renderTitle('Last Name'),
      dataIndex: 'last_name',
      key: 'last_name',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
      ...getColumnSearchProps('last_name'),
      render: (_, record) =>
        record && (
          <EditTableCell
            editable={editable}
            value={record.last_name}
            onChange={value => handleEditValue(record, 'last_name', value)}
          />
        ),
    },
    {
      title: 'Superuser',
      dataIndex: 'is_superuser',
      key: 'is_superuser',
      filterMultiple: false,
      filters: BOOL_FILTERS,
      onFilter: (value, record) => record.is_superuser === value,
      render: (_, record) => record && userValueBoolean(record.is_superuser),
    },
    {
      title: 'Site',
      dataIndex: 'site',
      key: 'site',
    },
    {
      title: renderTitle('Site Role'),
      dataIndex: 'site_role',
      key: 'site_role',
      filters: SITE_ROLES.map(siteRole => ({ text: siteRole.text, value: siteRole.text })),
      onFilter: (value, record) => record.role.includes(value),
      render: (_, record) =>
        record && (
          <EditTableCell
            editable={editable}
            selects={SITE_ROLES}
            input="select"
            field="site_role"
            value={record.site_role}
            onChange={value => handleEditValue(record, 'site_role', value)}
          />
        ),
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: isNotDesktop && 'right',
      render: (_, record) => record && userTableDropdown(record),
    },
  ]

  return (
    <React.Fragment>
      <Table
        bordered
        size="small"
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        tableLayout="auto"
        scroll={{ x: 900 }}
        pagination={{ size: 'large' }}
      />
      <Drawer title="User Profile" width="400" visible={showDrawer} onClose={() => setShowDrawer(false)}>
        <UserProfile user={user} />
      </Drawer>
      <Modal
        title="Set Password"
        visible={passwordModal}
        footer={null}
        onOk={() => setPasswordModal(true)}
        onCancel={() => setPasswordModal(false)}
        width={400}
        destroyOnClose
      >
        <SetPasswordForm userSelected={userSelected} onClose={() => setPasswordModal(false)} />
      </Modal>
    </React.Fragment>
  )
}

UserTable.propTypes = {
  editable: PropTypes.bool,
  setLoading: PropTypes.bool,
  setSelectedKeys: PropTypes.array,
  selectedKeys: PropTypes.string,
  isNotDesktop: PropTypes.bool,
  listUser: PropTypes.func,
  confirm: PropTypes.func,
  clearFilters: PropTypes.func,
}

/* istanbul ignore next */
const sizes = ({ width }) => ({
  isNotDesktop: width <= BREAKPOINTS.LG,
})

export default withSizes(sizes)(UserTable)
