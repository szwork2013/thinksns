import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import AppBar from './AppBar.jsx';
import guid from './util/guid';

class UserPhotoList extends React.Component
{
    constructor(props) {
        super(props);

        this.uid = props.params.uid;
        this.state = {
            photos: [],
        };
    }

    componentDidMount() {
        this._componentInitHandle();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.params.uid != this.uid) {
            this.uid = newProps.params.uid;
            this._componentInitHandle();
        } else {
            appNode.style.display = 'block';
        }
    }

    _componentInitHandle() {
        appNode.style.display = 'block';
        
        $.ajax({
            url: buildURL('user', 'photos'),
            type: 'POST',
            dataType: 'json',
            data: {uid: this.uid},
        })
        .done(function(photos) {
            if (photos.length) {
                this.state.photos = photos;
            } else {
                this.state.photos = [];
            }
        }.bind(this))
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            this.setState(this.state);
        }.bind(this));

    }

    render() {
        console.log(this.state.photos);
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.root}>
                    <AppBar
                        title={'相册'}
                        iconElementLeft={
                            <IconButton onTouchTap={goBack}>
                                <NavigationChevronLeft />
                            </IconButton>
                        }
                    />
                    <GridList
                        cols={4}
                    >
                        {
                            this.state.photos.map(({ src }) => (
                                <GridTile
                                    key={guid()}
                                >
                                    <img src={src} />
                                </GridTile>
                            ))
                        }
                    </GridList>
                </div>
            </MuiThemeProvider>
        );
    }
}

const styles = {
    root: {
        paddingTop: '50px',
    },
    box: {
        justifyContent: 'space-around',
    }
};

export default UserPhotoList;
