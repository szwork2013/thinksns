/**
 * FeedListComponent.
 */
import React, { Component, PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import formatClientName from '../util/formatClientName';

// icons
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import CommunicationMessage from 'material-ui/svg-icons/communication/message';
import NavigationMoreHoriz from 'material-ui/svg-icons/navigation/more-horiz';

class FeedListComponent extends Component {

  static propTypes = {
    list: PropTypes.array.isRequired,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  render() {
    const { list } = this.props;
    const { muiTheme } = this.context;
    console.log(muiTheme);
    const {
      baseTheme: { spacing: { desktopGutterLess } },
      button: { iconButtonSize, height },
    } = muiTheme;

    return (
      <div
        data-node-name="FeedListComponent"
        style={{
          width: '100%',
          height: 'auto',
        }}
      >
        <List
          data-node-name="FeedListComponent,List"
          style={{
            backgroundColor: '#fff',
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {
            list.map(({ date, type, images, feed, user }) => ([
              (
                <ListItem
                  disabled={true}
                  disableKeyboardFocus={true}
                  key={feed.id}
                  data-node-name="FeedListComponent,List,ListItem"
                  leftAvatar={<Avatar
                    data-node-name="FeedListComponent,List,ListItem,Avatar"
                    src={user.face}
                    style={{
                      top: desktopGutterLess
                    }} 
                  />}
                  autoGenerateNestedIndicator={true}
                  style={{
                    paddingTop: desktopGutterLess,
                  }}
                >
                  {user.username}
                  <div
                    data-node-name="FeedListComponent,ListItem,user,info"
                    style={{
                      overflow: 'hidden',
                      margin: '4px 0px 0px',
                      color: 'rgba(0, 0, 0, 0.541176)',
                      lineHeight: '16px',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '14px',
                      height: '16px',
                      marginBottom: 8,
                    }}
                  >
                    {date}&nbsp;&nbsp;来自{formatClientName(feed.from)}
                  </div>
                  {feed.content}
                  <div
                    data-node-name="FeedListComponent,ListItem,buttoms"
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      paddingTop: 8,
                    }}
                  >
                    <FlatButton
                      hoverColor="#fff"
                      label="0"
                      icon={<ActionFavoriteBorder />}
                    />
                    <FlatButton
                      hoverColor="#fff"
                      label="0"
                      icon={<CommunicationMessage />}
                    />
                    <IconButton
                      style={{
                        height,
                        width: height,
                        padding: 0,
                      }}
                    >
                      <NavigationMoreHoriz />
                    </IconButton>
                  </div>
                </ListItem>
              ),
              (<Divider inset={false} />)
            ]))
          }
        </List>
      </div>
    );
  }

}

export default FeedListComponent;
