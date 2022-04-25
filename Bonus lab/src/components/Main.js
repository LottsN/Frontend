import React, { Component } from 'react';
import localforage from 'localforage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}

	render() {
		// muiTheme={getMuiTheme(darkBaseTheme)}
		return (
			<MuiThemeProvider key="themeProvider">
				<div className="container" key="container">
					{this.props.children}
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
