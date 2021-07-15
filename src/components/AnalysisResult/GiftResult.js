import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { downloadHTML } from 'utils/analyses'
import { encodePathURL } from 'utils/analyses'

export default class GiftResult extends Component {
  static propTypes = {
    token: PropTypes.string,
    id: PropTypes.number,
    data: PropTypes.shape({
      out_dir: PropTypes.string,
      save_path: PropTypes.string,
    }),
  }

  state = {
    renderedHtml: '',
  }

  componentDidMount() {
    const { id, token, data } = this.props
    this.handleDownloadResult(id, token, data)
  }

  handleDownloadResult = (id, token, data) => {
    const { out_dir, save_path } = data

    const outDir = out_dir || save_path
    /* istanbul ignore next */
    downloadHTML(id).then(response =>
      this.setState({ renderedHtml: response }, () => {
        const images = document.querySelectorAll('.analysis-result img')
        images.forEach(image => {
          const src = image.getAttribute('src')
          image.src = encodePathURL(outDir, src, token)
        })
      }),
    )
  }

  render() {
    const { renderedHtml } = this.state

    return <div className="analysis-result" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
  }
}
