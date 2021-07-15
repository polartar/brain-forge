import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { toBase64Image } from 'utils/common'

const AnalysisResultFigure = ({ figures }) => (
  <div className="analysis-result">
    <div className="analysis-result__subheading">Figures</div>
    {figures &&
      map(figures, (figure, key) => (
        <div key={key}>
          <img src={toBase64Image(figure)} width="100%" alt="" />
        </div>
      ))}
  </div>
)

AnalysisResultFigure.propTypes = {
  figures: PropTypes.any,
}

export default AnalysisResultFigure
