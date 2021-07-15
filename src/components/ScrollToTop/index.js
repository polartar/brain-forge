import { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

export class ScrollToTop extends Component {
  static propTypes = {
    location: PropTypes.object,
    children: PropTypes.node,
  }

  componentDidUpdate(prevProps) {
    /* istanbul ignore next */
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(ScrollToTop)
