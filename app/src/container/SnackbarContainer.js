/**
 * SnackbarContainer.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SnackbarComponent from 'material-ui/Snackbar';

const mapStateToProps = state => state;

class SnackbarContainer extends Component {
  render() {

    const { open, message, children, props } = this.props;

    return (
      <SnackbarComponent
        {...props}
        open={open}
        message={message}
      />
    );
  }
}

export default connect(mapStateToProps)(SnackbarContainer);
