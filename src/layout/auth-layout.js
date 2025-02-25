import React, {useCallback, useState} from 'react'
import SignInPage from '../pages/sign-in-page'
import {getAuth} from '../api/auth'

export default function AuthLayout({children}) {
    const [authorized, setAuthorized] = useState(getAuth())
    const onLogin = useCallback(() => setAuthorized(getAuth()), [])
    if (!authorized)
        return <SignInPage login={onLogin}/>

    return <>{children}</>
}