import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { Header, Sidebar } from 'containers'

const { Content } = Layout

const MainLayout = ({ children }) => (
  <Layout className="main-layout">
    <Sidebar />
    <Layout>
      <Header />
      <Content style={{ flex: 1 }}>
        <main className="main-content">{children}</main>
      </Content>
    </Layout>
  </Layout>
)

MainLayout.propTypes = {
  children: PropTypes.node,
}

export default MainLayout
