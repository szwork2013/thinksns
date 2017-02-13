import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import List from 'material-ui/List/List';
import Snackbar from 'material-ui/Snackbar';
import request from 'superagent';
import FeedItem from './feed-item';
import guid from '../util/guid';

class commonFeedList extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      Snackbar: {
        open: false,
        message: '',
      }
    }
    this.max = 0;
    this.min = 0;
    this.cacheKeyName = this.props.cacheKeyName;
    this.scroll = true;
  }

  componentWillReceiveProps(props) {
    this.props = props;
    this.componentWillUnmount();
    this.max = 0;
    this.min = 0;
    this.cacheKeyName = props.cacheKeyName;
    this.scroll = true;
    this.state.feeds = [];
    this.componentDidMount();
  }

  componentDidMount() {
    let load = loadTips('正在加载...');
    $.ajax({
      url: this.props.uri,
      type: 'POST',
      dataType: 'json',
      data: {
        max: this.max
      },
    })
    .done(function(data) {
      this.state.feeds = data;
      if (data.length >= 1) {
        this.max = data[0].feed.id;
        this.min = data[data.length - 1].feed.id;
      }
    }.bind(this))
    .fail(function() {
      this.state.Snackbar.open = true;
      this.state.Snackbar.message = '请检查网络状态!';
    }.bind(this))
    .always(function() {
      load.hide();
      this.setState(this.state);
    }.bind(this));

    document.body.scrollTop = 0;
    this.scrollHandle = this.handleScroll.bind(this);
    // 滚动事件
    document.addEventListener('scroll', this.scrollHandle);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.scrollHandle);
  }

  render() {
    return (
      <div ref={'box'}>
        {this.state.feeds.length < 1
          ? (<TipsEmpty message={this.props.emptyMessage} />)
          : (
            this.state.feeds.map((data) => <FeedItem key={guid()} data={data} />)
          )
        }
        <Snackbar
          open={this.state.Snackbar.open}
          message={this.state.Snackbar.message}
          autoHideDuration={1500}
          onRequestClose={() => {
            this.state.Snackbar.open = false,
            this.setState(this.state);
          }}
        />
      </div>
    );
  }

  handleAppendFeedItem(data) {
    let divDOM = document.createElement('div');
    this.refs.box.appendChild(divDOM);
    ReactDOM.render(
      (<MuiThemeProvider muiTheme={muiTheme}>
        <FeedItem data={data} />
      </MuiThemeProvider>),
      divDOM
    );
  }

  handleScroll() {
    if (this.scroll == true) {
      let top = document.body.scrollTop + document.body.clientHeight;
      let height = document.body.scrollHeight;
      if (height - top < 500) {
        this.scroll = false;
        request
          .post(this.props.uri)
          .field('min', this.min)
          .end((error, ret) => {
            if (!error) {
              ret.body.forEach((data) => {
                this.handleAppendFeedItem(data);
                this.min = data.feed.id;
              });
            }
            setTimeout(function() {
              this.scroll = true;
            }.bind(this), 1000);
          })
        ;
      }
    }
  }
}

export default commonFeedList;
