import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconButton from 'material-ui/IconButton';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

import AppBar from './AppBar';
import FeedItem from './feed/feed-item';
import guid from './util/guid';

class UserFeedList extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            feeds: [],
        };
    }

    componentDidMount() {
        // appNode.style.display = 'block';
        // console.log(123);
        this.handleInitLoadData();
    }

    // componentDidUpdate() {
    //     appNode.style.display = 'block';
    // }

    // componentWillReceiveProps(newProps) {
    //     // console.log(newProps.params.uid);
    //     // console.log(this.props.params.uid);
    //     this.handleInitLoadData();
    // }

    handleInitLoadData() {
        let load = loadTips('正在加载...');
        $.ajax({
            url: buildURL('user', 'feeds'),
            type: 'POST',
            dataType: 'json',
            data: {param1: 'value1'},
        })
        .done(function(data) {
            this.state.feeds = data;
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
        appNode.style.display = 'block';
        $('.mdl-layout__container').hide();
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <AppBar
                        title={'我的分享'}
                        iconElementLeft={
                            <IconButton onClick={goBack}>
                                <NavigationChevronLeft />
                            </IconButton>
                        }
                    />
                    {this.state.feeds.map(function(data) {
                        return (<FeedItem key={guid()} data={data} />);
                    })}
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

UserFeedList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default UserFeedList;
