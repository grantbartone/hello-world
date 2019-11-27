import React from 'react';
import ReactGA from 'react-ga';
import './App.css';
import ConnectN from './connectN';

function App() {
	initializeReactGA();
	return (
		<div className="App">
			<ConnectN />
			<div className="center">By: Grant Bartone</div>
		</div>
	);
}

function initializeReactGA() {
	ReactGA.initialize('G-RJDR3ET5KK');
	ReactGA.pageview(window.location.pathname + window.location.search);
}

export default App;
