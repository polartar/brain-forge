import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Row, Col, Card } from 'antd'
import { map } from 'lodash'
import { CardDescription } from 'components'

const SolutionSection = ({ problem }) => (
  <Row gutter={20} type="flex" justify="center">
    {map(problem.solution_sets, ({ id, name, description, analysis_types }) => (
      <Col key={id} xs={24} sm={24} md={12} lg={6}>
        <Card
          type="inner"
          title={
            <Link to={`/solution/${id}`}>
              <span className="card-title">{name}</span>
            </Link>
          }
          hoverable
        >
          <CardDescription description={description} sets={analysis_types} baseUrl="/analysis-start" />
        </Card>
      </Col>
    ))}
  </Row>
)

SolutionSection.propTypes = {
  problem: PropTypes.shape({
    solution_sets: PropTypes.array,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
}

export default SolutionSection
