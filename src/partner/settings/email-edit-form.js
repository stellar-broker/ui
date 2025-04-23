import React, {useCallback, useState} from 'react'
import {getAuth} from '../../api/auth'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {Button} from '../../components/ui/button'
import {Dialog} from '../../components/ui/dialog'
import validateEmail from '../../utils/validate-email'

export default function EmailEditForm() {
    const userData = getAuth()
    const [email, setEmail] = useState(userData.email)
    const [isOpen, setIsOpen] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

    const changeEmail = useCallback(e => {
        const val = e.target.value.trim()
        setEmail(val)
        setIsValid(validateEmail(val))
    }, [])

    const updateEmail = useCallback(() => {
        //TODO update email use API
        toggleDialog()
        notify({type: "success", message: "Email changed successfully"})
    }, [email])

    const onKeyDown = useCallback(e => {
        if (e.keyCode === 13 && isValid) {
            updateEmail()
        }
    }, [isValid])

    return <div>
        <div className="dual-layout middle double-space">
            <div className="text-tiny">
                <strong>Email</strong>
                <div className="dimmed">{email}</div>
            </div>
            <div>
                <Button small secondary onClick={toggleDialog} style={{margin: 0}}>Change</Button>
            </div>
        </div>
        <Dialog dialogOpen={isOpen} className="text-left">
            <div className="micro-space"><h5>Change email</h5></div>
            <div className="space">
                <p className="label text-small">Email</p>
                <input value={email || ''} onChange={changeEmail} ref={useAutoFocusRef} onKeyDown={onKeyDown} className="styled-input"/>
            </div>
            <div className="row">
                <div className="column column-33 column-offset-33">
                    <Button outline block onClick={toggleDialog}>Cancel</Button>
                </div>
                <div className="column column-33">
                    <Button block disabled={!isValid} onClick={updateEmail}>Save</Button>
                </div>
            </div>
        </Dialog>
    </div>
}