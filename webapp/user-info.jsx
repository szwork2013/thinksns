import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
// import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

import AppBar from './AppBar.jsx';

class UserInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      face: '',
      username: '',
      sex: 0,
      location: '',
      intro: '暂无简介',
      tag: '暂无标签',
      level_img: '',
      credit: 0,
    };
  }

  componentDidMount() {
    appNode.style.display = 'block';

    let load = loadTips('加载中...');
    $.ajax({
      url: buildURL('user', 'info'),
      type: 'POST',
      dataType: 'json',
      data: {uid: this.props.params.uid},
    })
    .done(function(user) {
      this.state = user;
    }.bind(this))
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      load.hide();
      this.setState(this.state);
    }.bind(this));
  }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <AppBar
                        title={'基本信息'}
                        iconElementLeft={
                            <IconButton onClick={goBack}>
                                <NavigationChevronLeft />
                            </IconButton>
                        }
                    />
                    <List>
                      <ListItem
                        leftAvatar={<Avatar src={this.state.face} />}
                        primaryText={'个人头像'}
                      />
                    </List>
                    <Divider />
                    <List>
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>昵称</span>}
                        primaryText={this.state.username}
                      />
                      <Divider inset={true} />
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>性别</span>}
                        primaryText={this.state.sex == 1
                          ? '男'
                          : (this.state.sex == 2
                            ? '女'
                            : '未知'
                          )
                        }
                      />
                      <Divider inset={true} />
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>地区</span>}
                        primaryText={this.state.location}
                      />
                      <Divider inset={true} />
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>简介</span>}
                        primaryText={this.state.intro}
                      />
                      <Divider inset={true} />
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>标签</span>}
                        primaryText={this.state.tag}
                      />
                    </List>
                    <Divider />
                    <List>
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>积分</span>}
                        primaryText={this.state.credit}
                      />
                      <Divider inset={true} />
                      <ListItem
                        leftAvatar={<span style={styles.leftName}>等级</span>}
                        primaryText={<img src={this.state.level_img} />}
                      />
                    </List>
                </div>
            </MuiThemeProvider>
        );
    }
}

const styles = {
  root: {
    paddingTop: '50px',
  },
  leftName: {
    top: 'none',
    color: "#9e9e9e",
  }
};

export default UserInfo;
