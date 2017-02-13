import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import request from 'superagent';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import AppBar from '../AppBar';
import guid from '../util/guid';

import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import ActionSearch from 'material-ui/svg-icons/action/search';

class WeibaAllBox extends Component
{
   constructor(props) {
    super(props);
    this.state = {
      weibas: [],
    }
    this.weibas = [];
   }

   componentDidMount() {
      request
         .get(buildURL('weiba', 'getWeibas'))
         .end((error, ret) => {
            if (error) {
            } else {
               this.weibas = ret.body;
               this.setState({
                  weibas: ret.body
               });
            }
         })
      ;
   }

   render() {
      appNode.style.display = 'block';
      $('.mdl-layout__container').hide();
      return (
         <MuiThemeProvider muiTheme={muiTheme}>
            <div style={styles.root}>
               <AppBar
                  iconElementLeft={
                     <IconButton onTouchTap={goBack}>
                        <NavigationChevronLeft />
                     </IconButton>
                  }
                  title={
                     <div style={styles.search}>
                        <div style={styles.searchBox}>
                           <ActionSearch color={'#bdbdbd'} />
                           <input
                              style={styles.searchInput}
                              placeholder="微吧搜索"
                              onChange={this.handleKeyWordChange.bind(this)}
                           />
                        </div>
                     </div>
                  }
               />
               <List
                  style={styles.List}
               >
                  {this.state.weibas.map((weiba) => {
                     return [
                        <ListItem
                           key={guid()}
                           leftAvatar={<Avatar src={weiba.avatar_big} />}
                           primaryText={weiba.weiba_name}
                           secondaryText={weiba.intro}
                           onTouchTap={() => {
                              this.context.router.push(`/weiba/reader/${weiba.weiba_id}`);
                           }}
                        />,
                        <Divider />
                     ];
                  })}
               </List>
            </div>
         </MuiThemeProvider>
      );
   }

   handleKeyWordChange(event) {
      if (event.target.value == '') {
         this.setState({
             weibas: this.weibas,
         });
      } else {
         let weibas = [];
         this.weibas.map(function(weiba) {
             if (weiba.weiba_name.indexOf(event.target.value) > -1) {
               weibas.push(weiba);
            }
         });
         this.setState({
             weibas: weibas,
         });
     }
   }
}

const styles = {
   root: {
      width: '100%',
      height: 'auto',
      paddingTop: 50,
   },
   search: {
      boxSizing: 'border-box',
      // display: 'flex',
      width: '100%',
      height: '100%',
      paddingTop: 6,
      paddingBottom: 6,
      // flexDirection: 'row',
      // alignItems: 'center',
   },
   searchBox: {
      boxSizing: 'border-box',
      display: 'flex',
      width: '100%',
      height: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 6,
      backgroundColor: '#f0f0f0',
   },
   searchInput: {
      flexGrow: 1,
      height: '100%',
      boxSizing: 'border-box',
      paddingLeft: 6,
      outline: 'none',
      border: 'none',
      backgroundColor: 'transparent',
   },
   List: {
      backgroundColor: '#fff',
   }
};

WeibaAllBox.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default WeibaAllBox;