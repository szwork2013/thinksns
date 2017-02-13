import React, {Component} from 'react';
import ActionSearch from 'material-ui/svg-icons/action/search';
import Snackbar from 'material-ui/Snackbar';
import request from 'superagent';
import guid from '../util/guid';
import Cache from '../util/cache';

class TopicInsert extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      insert: '',
      Snackbar: {
        open: false,
        message: '',
      }
    }
    this.cacheKeyName = 'h5-send-topic-hots';
  }

  componentDidMount() {
    if (Cache.hasItem(this.cacheKeyName)) {
      this.state.topics = Cache.getItem(this.cacheKeyName);
      this.setState(this.state);
    } else {
      request
        .get(buildURL('feedTopic', 'getHotTopics'))
        .end((error, ret) => {
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '请求错误，请检查网络';
          } else {
            this.state.topics = ret.body;
            Cache.setItem(this.cacheKeyName, ret.body);
          }
          this.setState(this.state);
        })
      ;
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            width: '100%',
            height: 50,
            paddingTop: 10,
            paddingRight: 12,
            paddingBottom: 10,
            paddingLeft: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#b3b3b3',
          }}
        >
          <div
            style={{
              flexGrow: 1,
              boxSizing: 'border-box',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              paddingLeft: 6,
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#fff',
              borderRadius: 6,
            }}
          >
            <ActionSearch color={'#c4c4ca'} />
            <input
              style={{
                width: '100%',
                height: '100%',
                outline: 'none',
              }}
              ref={'input'}
              onChange={() => {
                if (!this.refs.input.value) {
                  this.state.topics = Cache.getItem(this.cacheKeyName);
                  this.setState(this.state);
                }
              }}
            />
          </div>
          <span
            style={{
              width: 48,
              textAlign: 'center',
              paddingLeft: 10,
              color: '#f9f9f9',
            }}
            onTouchTap={this.handleSearch.bind(this)}
          >
            搜索
          </span>
        </div>
        {this.state.insert
          ? (
            <div
              style={{
                boxSizing: 'border-box',
                width: '100%',
                paddingTop: 10,
                paddingRight: 24,
                paddingBottom: 10,
                paddingLeft: 24,
                fontSize: 18,
                fontWeight: 300,
                borderBottom: '#ebebeb solid 1px',
              }}
              onTouchTap={this.handleTopicTouchTap.bind(this, this.state.insert)}
            >
              {this.state.insert}
            </div>
          )
          : null
        }
        {this.state.topics.map((topic) => (
          <div
            key={guid()}
            style={{
              boxSizing: 'border-box',
              width: '100%',
              paddingTop: 10,
              paddingRight: 24,
              paddingBottom: 10,
              paddingLeft: 24,
              fontSize: 18,
              fontWeight: 300,
              borderBottom: '#ebebeb solid 1px',
            }}
            onTouchTap={this.handleTopicTouchTap.bind(this, topic.name)}
          >
            {topic.name}
          </div>
        ))}
        <Snackbar
          open={this.state.Snackbar.open}
          message={this.state.Snackbar.message}
        />
      </div>
    );
  }

  handleTopicTouchTap(name) {
    // console.log(name);
    this.props.handleSlectTopic(name);
  }

  handleSearch() {
    this.state.insert = this.refs.input.value;

    if (!this.state.insert) {
      this.state.topics = Cache.getItem(this.cacheKeyName);
      this.setState(this.state);
    } else {
      let load = loadTips('搜索中...')
      request
        .post(buildURL('feedTopic', 'getTopicList'))
        .field('key', this.state.insert)
        .end((error, ret) => {
          if (error) {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '网络错误，请检查网络状态。';
          } else {
            this.state.topics = ret.body;
          }
          this.setState(this.state);
          load.hide();
        })
      ;
    }
  }
}

TopicInsert.propTypes = {
  handleSlectTopic: React.PropTypes.func,
};
TopicInsert.defaultProps = {
  handleSlectTopic: (name) => {},
};

export default TopicInsert;