import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import List from 'material-ui/List/List';
import CircularProgress from 'material-ui/CircularProgress';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

// icons
// import FileCloudDownload from 'material-ui/svg-icons/file/cloud-download';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ContentAdd from 'material-ui/svg-icons/content/add';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';

import AppBar from './AppBar';
import FeedItem from './feed/feed-item';
import guid from './util/guid';

class ChannelReader extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            info: {
                channel_category_id: 0,
                desc: null,
                image: null,
                title: '',
            },
            feeds: [],
            refreshStatus: false,
            Snackbar: {
                open: false,
                message: '',
            }
        };

        this.max = 0;
        this.min = 0;
    }

    componentWillReceiveProps(newProps) {
        this.state.feeds = [];
        var load = loadTips('正在加载数据...');
        $.ajax({
            url: buildURL('channel', 'getChannelInfo'),
            type: 'POST',
            dataType: 'json',
            data: {id: newProps.params.id},
        })
        .done(function(channelInfo) {
            this.state.info = channelInfo;
            channelInfo = null;
        }.bind(this))
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            this.setState(this.state);
        }.bind(this));

        $.ajax({
            url: buildURL('channel', 'getFeedList'),
            type: 'POST',
            dataType: 'json',
            data: {id: newProps.params.id},
        })
        .done(function(datas) {
            // console.log(datas);
            if (datas) {
                // console.log(datas);
                this.state.feeds = datas;

                if (typeof datas[datas.length - 1] !== 'undefined') {
                    this.min = datas[datas.length - 1].channel.linkId;
                }
                if (typeof datas[0] !== 'undefined') {
                    this.max = datas[0].channel.linkId;
                }

            } else {
            }
        }.bind(this))
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            // console.log(this.state);
            load.hide();
            this.setState(this.state);
        }.bind(this));
    }

    componentDidMount() {
        appNode.style.display = 'block';
        this.componentWillReceiveProps(this.props);
    }

    getThisChannelImages() {
        if (this.state.info.image !== null) {
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

    getThisChannelDesc() {
        if (this.state.info.desc !== null) {
            return (<Subheader style={styles.Subheader}>{this.state.info.desc}</Subheader>);
        }
        return null;
    }

    handleScroll(event) {
        let t = event.target.scrollTop + event.target.offsetHeight,
            h = event.target.scrollHeight,
            x = h - t,
            n = 200
        ;

        this.scrollTop = t;

        // console.log(event.target.scrollTop);
        // console.log(event.target.offsetHeight);
        // console.log(event.target.scrollHeight);
        
        if (event.target.scrollTop <= 0) {
            this.maxState = true;
        } else if (this.maxState === true) {
            this.maxState = false;
        }
        
        // console.log(t, h);

        // console.log(this.refs.contentBox.target.offsetHeight);
        if (this.minState === true && x <= n) {
            this.minState = false;
            $.ajax({
                url: buildURL('channel', 'getFeedList'),
                type: 'POST',
                dataType: 'json',
                data: {id: this.props.params.id, min: this.min},
            })
            .done(function(datas) {
                if (datas.length) {
                    this.min = datas[datas.length - 1].channel.linkId;
                    this.state.feeds = this.state.feeds.concat(datas);
                    this.minState = true;
                } else {
                    this.minState = false;
                }
            }.bind(this))
            .fail(function() {
                this.state.Snackbar.open = true;
                this.state.Snackbar.message = '哎哟，网络貌似有点问题哦！';
            }.bind(this))
            .always(function() {
                this.setState(this.state);
            }.bind(this));
            
        }

        t = h = x = null;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <AppBar
                        title={this.state.info.title}
                        iconElementLeft={
                            <IconButton onTouchTap={goBack}>
                                <NavigationChevronLeft />
                            </IconButton>
                        }
                        iconElementRight={this.state.refreshStatus == false
                            ? (
                                // <IconMenu
                                //     iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                                //     anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                //     targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                // >
                                //     <MenuItem primaryText="刷新" onTouchTap={this.handleRefresh.bind(this)} />
                                //     <MenuItem primaryText="频道发布" />
                                // </IconMenu>
                                <IconButton onTouchTap={this.handleRefresh.bind(this)}>
                                    <NavigationRefresh />
                                </IconButton>
                            )
                            : (<CircularProgress size={0.5} />)
                        }
                    />
                    {this.getThisChannelImages()}
                    {this.getThisChannelDesc()}
                    <List>
                        {this.state.feeds.map((data) => <FeedItem key={guid()} data={data} />)}
                    </List>
                    <Snackbar
                        open={this.state.Snackbar.open}
                        message={this.state.Snackbar.message}
                        autoHideDuration={1500}
                        onRequestClose={() => {
                            this.state.Snackbar.open = false;
                            this.state.Snackbar.message = '';
                            this.setState(this.state);
                        }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }

    handleRefresh() {
        this.state.refreshStatus = true;
        this.setState(this.state);

        $.ajax({
            url: buildURL('channel', 'getFeedList'),
            type: 'POST',
            dataType: 'json',
            data: {
                id: this.props.params.id,
                max: this.max,
            },
        })
        .done(function(data) {
            if (data.length) {
                this.max = data[0].channel.linkId;
                this.state.feeds = data.concat(this.state.feeds);
            } else {
                this.state.Snackbar.open = true;
                this.state.Snackbar.message = '暂时没有新的内容。😂';
            }
        }.bind(this))
        .fail(function() {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '哎哟，网络貌似有点问题哦！';
        })
        .always(function() {
            this.state.refreshStatus = false;
            this.setState(this.state);
        }.bind(this));
    }
}

const styles = {
    Subheader: {
        paddingRight: '16px',
        wordWrap: 'normal',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    root: {
        paddingTop: '50px',
    }
};

export default ChannelReader;
