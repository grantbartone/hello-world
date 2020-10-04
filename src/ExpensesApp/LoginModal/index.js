import React, { useState } from 'react'
import './styles.css'
import Logo from './logo-icons.svg'

/* Background: Originally built as a take-home project in vanilla JS in 2019, this login component
 * ported to React has a fun, intuitive "head-shake" gesture when the authentication fails.
 */
export default function LoginModal({ showTransactions }) {
    const ANIMATION_TIMEOUT = 500;

    const [ attemptsLeft, setAttemptsLeft ] = useState(3)
    const [ loginHint, setLoginHint ] = useState("")
    const [ shakeLogin, setShakeLogin ] = useState("")
    const [ loginFlyAway, setLoginFlyAway ] = useState("")

    const handleAuthSubmit = (e) => {
        e.preventDefault()
        switch(attemptsLeft) {
            case 3:
                setLoginHint("Login Failed. Please try again.")
                loginError()
                break
            case 2:
                setLoginHint("Failed again. A couple more tries...")
                loginError()
                break
            case 1:
                setLoginHint("Cool gesture, right?! Last time!")
                loginError()
                break
            default: // case 0
                loginSuccessful()
                return
        }
        setAttemptsLeft(attemptsLeft - 1)
    }

    const loginError = () => {
        setShakeLogin("shake", setTimeout(() => setShakeLogin(""), ANIMATION_TIMEOUT))
    }

    const loginSuccessful = () => setLoginFlyAway(
        "flyAway",
        setTimeout(() => showTransactions(), ANIMATION_TIMEOUT)
    )

    return (
        <div id="loginContent" className={`${shakeLogin} ${loginFlyAway}`}>
		<div className="loginLogo">
			<img src={Logo} alt="Expensify" />
		</div>
		<form className="loginForm" onSubmit={handleAuthSubmit}>
			<input type="email" name="username" placeholder="Email" autoFocus required />
			<input type="password" name="password" placeholder="Password" required />
            <div id="loginHint">{loginHint}</div>
			<input type="submit" value="Login" />
		</form>
	</div>
    )
}
