import React, { useState, useEffect } from 'react'
import LoginModal from './LoginModal'
import Transactions from './Transactions'

const APP_STATES = {
	'LOGIN': 'login',
	'TRANSACTIONS': 'transactions',
}

export default function ExpensifyApp({ dismissApp }) {
    const [ appState, setAppState ] = useState(APP_STATES.LOGIN)

    useEffect(() => {
        // This hack can be cleaned up using head manager library instead of a direct DOM update
        document.body.style = 'background-color: #37444c; color: white;'
        return () => document.body.style = 'background-color: null;  color: null'
    }, [])

    const handleShowTransactions = () => setAppState(APP_STATES.TRANSACTIONS)

    switch (appState) {
        case APP_STATES.TRANSACTIONS:
            return <Transactions dismissApp={dismissApp} />
        case APP_STATES.LOGIN:
        default: 
            return <LoginModal showTransactions={handleShowTransactions} />
    }
}
