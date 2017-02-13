import { React } from 'react';
import AppBar from 'material-ui/AppBar';

AppBar.defaultProps.style = {
	backgroundColor: '#fff',
	position: 'fixed',
	top: 0,
	right: 0,
	left: 0,
  boxShadow: '0 1px 0 #ebebeb',
};

AppBar.defaultProps.titleStyle = {
	color: '#333',
  fontSize: '18px',
}

AppBar.defaultProps.className = 'filter-bg-fff';


export default AppBar;
