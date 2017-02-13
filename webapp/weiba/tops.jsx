import React, {Component} from 'react';
import Posts from './posts';

class WeibaTops extends Component
{

  render() {
    return (<Posts num={30} recommend={1} />);
  }
}

export default WeibaTops;