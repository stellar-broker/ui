import React, {useState} from 'react'
import SignInPage from '../pages/sign-in-page'

export default function AuthLayout({children}) {
    const [authorized, setAuthorized] = useState(true)

    if (!authorized)
        return <SignInPage login={setAuthorized}/>

    return <>{children}</>
}