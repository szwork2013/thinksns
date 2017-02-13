import React, {Component} from 'react';

class Link extends Component
{
  constructor(props) {
    super(props);
  }

  render() {
    return <a
      className={this.props.className}
      style={this.props.style}
      href={'#' + this.props.to}
      onTouchTap={this.props.onTouchTap ? this.props.onTouchTap : this.handleTouchTap.bind(this)}
    >
      {this.props.children}
    </a>
  }

  handleTouchTap(event) {
    event.preventDefault();
    event.stopPropagation();
    router.push(this.props.to);
  }
}

Link.propTypes = {
  to: React.PropTypes.string.isRequired,
};

Link.defaultProps = {
  style: {},
  className: '',
  onTouchTap: false,
};

export default Link;