import React from 'react'
import LoginModal from './LoginModal'

export default function ExpensifyApp({ dismissLogin }) {
    return <LoginModal dismissLogin={dismissLogin} />
}
