import React, {useCallback, useState} from 'react'
import {getAuth} from '../api/auth'
import SignInPage from '../pages/sign-in-page'
import {navigation} from '../utils/navigation'

export default function AuthLayout({role, children}) {
    const [authorized, setAuthorized] = useState(checkAccess(role, getAuth()))
    const onLogin = useCallback(() => {
        const auth = getAuth()
        if (checkAccess('admin', auth) && !location.pathname.includes('admin'))
            return navigation.navigate('/admin/')
        if (checkAccess('partner', auth) && !location.pathname.includes('account'))
            return navigation.navigate('/account/')
        const isAllowed = checkAccess(role, auth)
        setAuthorized(isAllowed)
        if (!isAllowed)
            notify({type: 'warning', message: 'Access denied'})

    }, [role])
    if (!authorized)
        return <SignInPage onLogin={onLogin}/>

    return <>{children}</>
}

function checkAccess(role, auth) {
    if (!auth || auth.inactive)
        return null
    return auth.roles?.includes(role)
}