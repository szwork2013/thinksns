import React, {Component} from 'react';
import SvgIcon from 'material-ui/SvgIcon';

class AddIcon extends Component
{
  render() {
    return (
      <SvgIcon {...this.props}>
        <g transform="scale(0.046875, 0.046875)">
          <path d="M512 0c-282.7648 0-512 229.2352-512 512 0 282.7648 229.2352 512 512 512 282.7648 0 512-229.2352 512-512C1024 229.2352 794.7648 0 512 0zM704 524.8l-179.2 0 0 179.2c0 7.0784-5.7344 12.8-12.8 12.8-7.0656 0-12.8-5.7216-12.8-12.8L499.2 524.8l-179.2 0c-7.0656 0-12.8-5.7216-12.8-12.8 0-7.0784 5.7344-12.8 12.8-12.8l179.2 0L499.2 320c0-7.0784 5.7344-12.8 12.8-12.8 7.0656 0 12.8 5.7216 12.8 12.8l0 179.2 179.2 0c7.0656 0 12.8 5.7216 12.8 12.8C716.8 519.0784 711.0656 524.8 704 524.8z" />
          </g>
      </SvgIcon>
    );
  }
}

AddIcon.defaultProps = {
  viewBox: '0 0 48 48',
};

export default AddIcon;