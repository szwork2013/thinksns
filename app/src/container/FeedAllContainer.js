/**
 * FeedAllContainer.
 */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import request from 'superagent';
import { FEED_LIST_ALL } from '../util/uris';
import { setList } from '../action/CustomListAction';
import { circularProgressDialog } from '../util/dialog';
import FeedListComponent from '../component/FeedListComponent';

const mapStateToProps = state => ({list: state});

class FeedAllContainer extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
  };

  render() {
    const { list } = this.props;
    return (
      <FeedListComponent
        list={list}
      />
    );
  }

  componentDidMount() {
    const close = circularProgressDialog();
    const { dispatch } = this.props;

    request(FEED_LIST_ALL)
      .end((error, response) => {

        close();

        const { statusText = '网络连接失败', body = [] } = response;
        const { length } = body;

        if (length) {
          dispatch(setList(body));
        }

      });
  }
}

export default connect(mapStateToProps)(FeedAllContainer);
