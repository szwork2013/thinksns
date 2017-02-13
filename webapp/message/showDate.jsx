import React, {Component} from 'react';

class showDate extends Component
{
  render() {
    if (this.props.show != true) {
      return null;
    }
    return (
      <div style={styles.root}>
        <span style={styles.date}>{this.props.date}</span>
      </div>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 12,
  },
  date: {
    width: 'auto',
    color: '#fff',
    backgroundColor: '#e0e0e0',
    paddingTop: 2,
    paddingRight: 10,
    paddingBottom: 2,
    paddingLeft: 10,
    borderRadius: 4,
  }
}

export default showDate;