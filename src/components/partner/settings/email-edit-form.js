
import React, {useCallback, useState} from 'react'
import {getAuth} from '../../../api/auth'
import {Button} from '../../ui/button'

function EmailEditForm() {
    const userData = getAuth()
    const [email, setEmail] = useState(userData.email)
    const [isChanged, setIsChanged] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const changeEmail = useCallback(e => {
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        const val = e.target.value.trim()
        setEmail(val)
        setIsValid(emailRegex.test(val))
        setIsChanged(val !== userData.email)
    }, [])

    const updateEmail = useCallback(() => {
        //TODO update email use API
        notify({type: "success", message: "Email changed successfully"})
    }, [email])

    return <div className="row">
        <div className="column column-33">
            <div className="space">
                <p className="label text-small">Email</p>
                <input value={email || ''} onChange={changeEmail} className="styled-input"/>
            </div>
        </div>
        <div className="column column-33">
            <div className="label-space"/>
            {isChanged && <Button disabled={!isValid} onClick={updateEmail}>Save</Button>}
        </div>
    </div>
}

export default EmailEditForm