import React from 'react';
import ReactGA from 'react-ga';
import './App.css';

function App() {
	initializeReactGA();
	return (
		<div className="App">
		<header className="App-header">
			<p>
			Coming Soon
			</p>
		</header>
		</div>
	);
}

function initializeReactGA() {
	ReactGA.initialize('G-RJDR3ET5KK');
	ReactGA.pageview(window.location.pathname + window.location.search);
}

export default App;
