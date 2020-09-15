import React, { useState, useEffect } from 'react'
import './styles.css'
import Logo from './expensify-logo--reverse.svg'

/* Background: Originally built as a take-home project in vanilla JS in 2019, this login component
 * ported to React has a fun, intuitive "head-shake" gesture when the authentication fails.
 */
export default function LoginModal({ dismissLogin }) {
    const ANIMATION_TIMEOUT = 500;

    const [ attemptsLeft, setAttemptsLeft ] = useState(3)
    const [ loginHint, setLoginHint ] = useState("")
    const [ shakeLogin, setShakeLogin ] = useState("")
    const [ loginFlyAway, setLoginFlyAway ] = useState("")

    useEffect(() => {
        // This hack can be cleaned up using head manager library instead of a direct DOM update
        document.body.style = 'background-color: #37444c; color: white;'
        return () => document.body.style = 'background-color: null;  color: null'
    }, [])

    const handleAuthSubmit = (e) => {
        e.preventDefault()
        switch(attemptsLeft) {
            case 3:
                setLoginHint("Login Failed. Please try again.")
                loginError()
                break
            case 2:
                setLoginHint("Failed again. Try a couple more times...")
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
        setTimeout(() => dismissLogin(), ANIMATION_TIMEOUT)
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
