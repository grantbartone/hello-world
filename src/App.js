import React, { useState } from 'react';
import ReactGA from 'react-ga';
import './App.css';
import ConnectN from './connectN';
import ExpensesApp from './ExpensesApp';
import GameOfLife from './GameOfLife'

const APP_STATES = {
	'WELCOME': 'welcome',
	'CONNECT': 'connect',
	'EXPENSES_APP': 'expenses_app',
}

function App() {
	initializeReactGA();
	const [ appState, setAppState ] = useState(APP_STATES.WELCOME)

	const setWelcomeState = () => setAppState(APP_STATES.WELCOME)

	const handleLoginClick = () => setAppState(APP_STATES.EXPENSES_APP)

	const handleConnectClick = () => setAppState(APP_STATES.CONNECT)
	
	const renderWelcome = () => (
		<div className="welcome">
			<div className="welcome">
				Welcome to Grant's GithubIO site, where I'm hosting a few random projects I've built
				that are open-source on my <a href="https://github.com/grantbartone/hello-world" target="_blank" rel="noopener noreferrer">Github</a>.
			</div>
			<div className="welcome">Pick a button below from some interactive options:</div>
			<div className="welcome_buttons">
				<button onClick={handleLoginClick}>Check out my Expenses App</button>
				<button onClick={handleConnectClick}>Play Connect 4</button>
			</div>
			<GameOfLife />
		</div>
	)

	const renderCurrentState = () => {
		switch(appState) {
			case APP_STATES.CONNECT:
				return <ConnectN />
			case APP_STATES.EXPENSES_APP:
				return <ExpensesApp dismissApp={setWelcomeState} />
			case APP_STATES.WELCOME:
			default:
				return renderWelcome()
		}
	}

	return (
		<div className="App">
			{renderCurrentState()}
			<div className="welcome">By: Grant Bartone</div>
		</div>
	);
}

function initializeReactGA() {
	ReactGA.initialize('G-RJDR3ET5KK');
	ReactGA.pageview(window.location.pathname + window.location.search);
}

export default App;
