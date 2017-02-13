/**
 * DialogContainer.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DialogComponent from 'material-ui/Dialog';

const mapStateToProps = state => state;

class DialogContainer extends Component {
  render() {
    const { node, children, ...props } = this.props;
    return (
      <DialogComponent {...props}>
        {node}
      </DialogComponent>
    );
  }
}

export default connect(mapStateToProps)(DialogContainer);
