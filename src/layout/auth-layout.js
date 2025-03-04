import React, {useCallback, useState} from 'react'
import {getAuth} from '../api/auth'
import SignInPage from '../pages/sign-in-page'

export default function AuthLayout({role, children}) {
    const [authorized, setAuthorized] = useState(checkAccess(role, getAuth()))
    const onLogin = useCallback(() => {
        setAuthorized(checkAccess(role, getAuth()))
    }, [role])
    if (!authorized)
        return <SignInPage onLogin={onLogin}/>

    return <>{children}</>
}

function checkAccess(role, auth) {
    if (!auth)
        return null
    return auth.roles?.includes(role)
}