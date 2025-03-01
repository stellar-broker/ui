import React, {useCallback, useState} from 'react'
import {getAuth} from '../api/auth'
import SignInPage from '../pages/sign-in-page'
import NotFoundPage from '../pages/not-found-page'

export default function AuthLayout({role, children}) {
    const [authorized, setAuthorized] = useState(getAuth())
    const onLogin = useCallback(() => {
        setAuthorized(getAuth())
    }, [])
    if (!authorized)
        return <SignInPage onLogin={onLogin}/>

    if (!authorized.roles.includes(role))
        return <NotFoundPage/>

    return <>{children}</>
}