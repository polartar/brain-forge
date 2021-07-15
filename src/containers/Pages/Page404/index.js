import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon } from 'antd'

export default () => (
  <div className="app-page">
    <div className="app-page__subheading">
      <Icon type="close-circle" style={{ color: 'red', fontSize: '4rem' }} />
      <h2 className="mt-2" style={{ fontSize: '2rem' }}>
        404
      </h2>
      <h3>Sorry, the page you visited does not exist.</h3>
      <div className="mt-2">
        <Link to="/study">
          <Button type="primary">Back</Button>
        </Link>
      </div>
    </div>
  </div>
)
