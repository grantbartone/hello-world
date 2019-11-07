import React from 'react';
import ReactGA from 'react-ga';
import './App.css';
import ConnectN from './connectN/ConnectN';

function App() {
	initializeReactGA();
	return (
		<div className="App">
			<ConnectN />
		</div>
	);
}

function initializeReactGA() {
	ReactGA.initialize('G-RJDR3ET5KK');
	ReactGA.pageview(window.location.pathname + window.location.search);
}

export default App;
