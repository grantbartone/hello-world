import React, { useState } from 'react';
import ReactGA from 'react-ga';
import './App.css';
import ConnectN from './connectN';
import LoginModal from './LoginModal';

const APP_STATES = {
	'WELCOME': 'welcome',
	'CONNECT': 'connect',
	'LOGINMODAL': 'loginmodal',
}

function App() {
	initializeReactGA();
	const [ appState, setAppState ] = useState(APP_STATES.WELCOME)

	const setWelcomeState = () => setAppState(APP_STATES.WELCOME)

	const handleLoginClick = () => setAppState(APP_STATES.LOGINMODAL)

	const handleConnectClick = () => setAppState(APP_STATES.CONNECT)
	
	const renderWelcome = () => (
		<div className="welcome">
			<div className="welcome">
				Welcome to Grant's GithubIO site, where I'm working on hosting thing's I've built
				that are open-source on my <a href="https://github.com/grantbartone">Github</a>.
			</div>
			<div className="welcome">Pick a button below from some interactive options:</div>
			<div className="welcome_buttons">
				<button onClick={handleLoginClick}>Check out my Login UX</button>
				<button onClick={handleConnectClick}>Play Connect 4</button>
			</div>
		</div>
	)

	const renderCurrentState = () => {
		switch(appState) {
			case APP_STATES.CONNECT:
				return <ConnectN />
			case APP_STATES.LOGINMODAL:
				return <LoginModal dismissLogin={setWelcomeState} />
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
