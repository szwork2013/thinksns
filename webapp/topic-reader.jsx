import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader'
import AppBar from './AppBar.jsx';
import FeedItem from './feed/feed-item';
import guid from './util/guid';

// icon
import ContentAdd from 'material-ui/svg-icons/content/add';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';

class TopicReader extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            info: {
                topic_name: '',
                count: 0,
                image: '',
                // note: '',
            },
            feeds: [],
            refresh: 'ready',
        };

        this.max = 0;
        this.min = 0;
        this.maxState = true;
        this.minState = true;
    }

    componentWillReceiveProps(newProps) {
        var load = loadTips('正在加载...');

        $.ajax({
            url: buildURL('topic', 'getTopicInfo'),
            type: 'POST',
            dataType: 'json',
            data: {name: newProps.params.name},
        })
        .done(function(topicInfo) {
            this.state.info = topicInfo;
            topicInfo = null;
        }.bind(this))
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            this.setState(this.state);
        }.bind(this));

        $.ajax({
            url: buildURL('topic', 'getTopicFeeds'),
            type: 'POST',
            dataType: 'json',
            data: {name: newProps.params.name},
        })
        .done(function(datas) {
            // console.log(datas);
            if (datas) {
                // console.log(datas);
                this.state.feeds = datas;

                if (typeof datas[datas.length - 1] !== 'undefined') {
                    this.min = datas[datas.length - 1].linkId;
                }
                if (typeof datas[0] !== 'undefined') {
                    this.max = datas[0].linkId;
                }

            } else {
            }
        }.bind(this))
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            load.hide();
            this.setState(this.state);
        }.bind(this));

    }

    componentDidMount() {
        appNode.style.display = 'block';
        this.componentWillReceiveProps(this.props);
    }

    getThisChannelImages() {
        if (this.state.info.image) {
            var style = {
                width: '100%',
                height: '210px',
                backgroundImage: 'url(' + this.state.info.image + ')',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            };
            return (<div style={style} />);
        }

        return null;
    }

    handleOnScroll(event) {
        let t = event.target.scrollTop + event.target.offsetHeight,
            h = event.target.scrollHeight,
            x = h - t,
            n = x <= 200
        ;
        if (n && this.minState === true) {
            this.minState = false;
            $.ajax({
                url: buildURL('topic', 'getTopicFeeds'),
                type: 'POST',
                dataType: 'json',
                data: {
                    name: this.props.params.name,
                    min: this.min,
                },
            })
            .done(function(feeds) {
                if (feeds.length) {
                    if (typeof feeds[feeds.length - 1] !== 'undefined') {
                        this.min = feeds[feeds.length - 1].linkId;
                    }
                    this.state.feeds = this.state.feeds.concat(feeds);
                    this.minState = true;
                } else {
                    this.minState = false;
                }
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                this.setState(this.state);
            }.bind(this));
        }
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div
                    style={styles.root}
                    onScroll={this.handleOnScroll.bind(this)}
                >
                    <AppBar
                        title={this.state.info.topic_name}
                        iconElementLeft={
                            <IconButton onTouchTap={goBack}>
                                <NavigationChevronLeft />
                            </IconButton>
                        }
                        iconElementRight={
                            <IconButton onTouchTap={this.handleRefresh.bind(this)}>
                                <NavigationRefresh />
                            </IconButton>
                        }
                    />
                    {this.getThisChannelImages()}
                    <Subheader style={styles.Subheader}>该话题共有{this.state.info.count}条分享</Subheader>
                    {this.state.feeds.map(function(data) {
                        return (<FeedItem key={guid()} data={data} />);
                    })}
                </div>
            </MuiThemeProvider>
        );
    }

    handleRefresh() {
        $.ajax({
            url: buildURL('topic', 'getTopicFeeds'),
            type: 'POST',
            dataType: 'json',
            data: {
                name: this.props.params.name,
                max: this.max
            },
        })
        .done(function(data) {
            if (data.length) {
                this.max = data[0].linkId;
                this.state.feeds = data.concat(this.state.feeds);
            }
        }.bind(this))
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            this.setState(this.state);
        }.bind(this));
    }
}

const styles = {
    root: {
        boxSizing: 'border-box',
        paddingTop: '50px',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'scroll',
        WebkitOverflowScrolling: 'touch',
    },
    Subheader: {
        paddingRight: '16px',
        wordWrap: 'normal',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
}

export default TopicReader;
