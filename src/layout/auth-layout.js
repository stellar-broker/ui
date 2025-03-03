import React, {useCallback, useState} from 'react'
import {getAuth} from '../api/auth'
import SignInPage from '../pages/sign-in-page'

export default function AuthLayout({children}) {
    const [authorized, setAuthorized] = useState(getAuth())
    const onLogin = useCallback(() => {
        setAuthorized(getAuth())
    }, [])
    if (!authorized)
        return <SignInPage onLogin={onLogin}/>

    return <>{children}</>
}