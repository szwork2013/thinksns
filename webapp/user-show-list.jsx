import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import AppBar from './AppBar.jsx';

class UserShowList extends React.Component
{
    constructor(props) {
        super(props);

        this.controller = props.params.controller;
        this.action = props.params.action;
        this.uid = props.params.userId;

        this.state = {
            users: [],
            Snackbar: {
                open: false,
                message: '',
            }
        };
    }

    componentDidMount() {
        appNode.style.display = 'block';
        this._componentInitHandle();
    }

    _componentInitHandle() {
        var load = loadTips('正在加载数据...');
        $.ajax({
            url: buildURL(this.controller, this.action, {uid: this.uid}),
            type: 'POST',
            dataType: 'json',
            data: {param1: 'value1'},
        })
        .done(function(users) {
            if (users.length) {
                this.state.users = users;
                this.max = users[0].id;
                this.min = users[users.length - 1].id;
            } else {
                this.state.users = [];
            }
        }.bind(this))
        .fail(function() {
            this.state.Snackbar.open = true;
            this.state.Snackbar.message = '网络错误!';
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
                        title={this.props.params.title ? this.props.params.title : '用户列表'}
                        iconElementLeft={
                            <IconButton onTouchTap={goBack}>
                                <NavigationChevronLeft />
                            </IconButton>
                        }
                    />
                    {this.state.users.length
                        ? this.state.users.map((user) => {
                            return [
                                (<ListItem
                                    key={user.uid}
                                    leftAvatar={<Avatar src={user.face} />}
                                    primaryText={user.username}
                                    secondaryText={user.intro}
                                    onTouchTap={() => {
                                        this.context.router.push('/user/' + user.username);
                                    }}
                                />),
                                (<Divider inset={true} />)
                            ];
                        })
                        : (<TipsEmpty message={'暂时没有' + (this.props.params.title ? this.props.params.title : '用户列表')} />)
                    }
                    <Snackbar
                        open={this.state.Snackbar.open}
                        message={this.state.Snackbar.message}
                        autoHideDuration={1500}
                        onRequestClose={() => {
                            this.state.Snackbar.open = false;
                            this.setState(this.state);
                        }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

const styles = {
    root: {
        paddingTop: '50px',
    }
};

UserShowList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default UserShowList;
