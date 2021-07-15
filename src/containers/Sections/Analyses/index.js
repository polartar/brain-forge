import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button, Card, Col, Row } from 'antd'
import { map } from 'lodash'

const AnalysesSection = ({ solution }) => (
  <Row gutter={20} type="flex" justify="center">
    {map(solution.analysis_types, ({ id, name, description }) => (
      <Col key={id} xs={24} sm={24} md={12} lg={6}>
        <Card type="inner" title={<span className="card-title">{name}</span>} hoverable>
          {description}

          <Link to={`/analysis-start/${id}`}>
            <Button type="primary" style={{ width: '100%', display: 'block', marginTop: 17 }}>
              Create Analysis
            </Button>
          </Link>
        </Card>
      </Col>
    ))}
  </Row>
)

AnalysesSection.propTypes = {
  solution: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    analysis_types: PropTypes.array,
  }),
}

export default AnalysesSection
