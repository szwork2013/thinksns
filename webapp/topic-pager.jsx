import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';

import AppBar from './AppBar.jsx';

class TopicPager extends React.Component
{
	constructor(props) {
		super(props);

        this.state = {
            hots: [],
            topics: [],
            dialog: {
                open: false,
                message: ''
            },
            snackbar: {
                open: false,
                message: '',
            },
        };
	}

    componentDidMount() {
        appNode.style.display = 'block';

        var load = loadTips('正在加载数据...');

        $.ajax({
            url: buildURL('feedTopic', 'getTopicList'),
            type: 'POST',
            dataType: 'json',
            data: {param1: 'value1'},
        })
        .done(function(data) {
            this.state.topics = data;
            data = null;
        }.bind(this))
        .fail(function() {
            this.state.dialog.open = true;
            this.state.dialog.message = '网络错误！！'
        }.bind(this))
        .always(function() {
            this.setState(this.state);
            load.hide();
        }.bind(this));

        $.ajax({
            url: buildURL('feedTopic', 'getHotTopics'),
            type: 'POST',
            dataType: 'json',
            data: {param1: 'value1'},
        })
        .done(function(data) {
            this.state.hots = data;
            data = null;
        }.bind(this))
        .fail(function() {
            this.state.dialog.open = true;
            this.state.dialog.message = '网络错误！！'
        }.bind(this))
        .always(function() {
            this.setState(this.state);
            load.hide();
        }.bind(this));
    }

	render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <AppBar
                        title="话题"
                        iconElementLeft={
                            <IconButton onTouchTap={goBack}>
                                <FontIcon className="material-icons">chevron_left</FontIcon>
                            </IconButton>
                        }
                    />
                    <List>
                        <Subheader>热门话题</Subheader>
                        {this.getListNode(this.state.hots)}
                        <Divider />
                        <Subheader>正在发生的话题</Subheader>
                        {this.getListNode(this.state.topics)}
                    </List>
                    <Snackbar
                        open={this.state.snackbar.open}
                        message={this.state.snackbar.message}
                        autoHideDuration={1500}
                        onRequestClose={() => {
                            this.state.snackbar.open = false;
                            this.setState(this.state);
                        }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }

    getListNode(datas) {
        let self = this;
        return datas.map(function(topic, index) {
            if (index < this) {
                return ([
                    <ListItem
                        key={topic.id}
                        leftAvatar={<Avatar>{topic.name[0]}</Avatar>}
                        primaryText={topic.name}
                        secondaryText={'已有' + topic.feedNum + '条分享'}
                        rightIcon={<FontIcon className="material-icons">chevron_right</FontIcon>}
                        onTouchTap={() => {
                            if (topic.feedNum > 0) {
                                self.context.router.push(`/topic/reader/${encodeURI(topic.name)}`);
                            } else {
                                self.state.snackbar.open = true;
                                self.state.snackbar.message = '该话题没有分享内容！';
                                self.setState(self.state);
                            }
                            // console.log(self);
                        }}
                    />,
                    <Divider inset={true} />
                ]);
            } else {
                return (
                    <ListItem
                        key={topic.id}
                        leftAvatar={<Avatar>{topic.name[0]}</Avatar>}
                        primaryText={topic.name}
                        secondaryText={'已有' + topic.feedNum + '条分享'}
                        rightIcon={<FontIcon className="material-icons">chevron_right</FontIcon>}
                        onTouchTap={() => {
                            if (topic.feedNum > 0) {
                                self.context.router.push(`/topic/reader/${encodeURI(topic.name)}`);
                            } else {
                                self.state.snackbar.open = true;
                                self.state.snackbar.message = '该话题没有分享内容！';
                                self.setState(self.state);
                            }
                            // console.log(self);
                        }}
                    />
                );
            }
        }.bind(this));
    }
}

TopicPager.contextTypes = {
    router: React.PropTypes.object.isRequired
};

const styles = {
    root: {
        paddingTop: '50px',
    }
}

export default TopicPager;
