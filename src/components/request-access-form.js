import {useCallback, useState} from 'react'
import validateEmail from '../utils/validate-email'
import {Button} from './ui/button'

function validate({name, email, website}) {
    return validateEmail(email) && !!name && !!website
}

function RequestAccessForm({step, updateStep, stepAmount}) {
    const [info, setInfo] = useState({})
    const [isValid, setIsValid] = useState(false)

    const changeValue = useCallback((key, value) => {
        setInfo(prev => {
            const newInfo = {...prev, [key]: value}
            setIsValid(validate(newInfo))
            return newInfo
        })
    }, [])

    const changeName = useCallback(e => changeValue('name', e.target.value), [])

    const changeEmail = useCallback(e => changeValue('email', e.target.value.trim()), [])

    const changeWebsite = useCallback(e => changeValue('website', e.target.value.trim()), [])

    const subject = 'Integration request from '+ info.name
    const body= `Company: ${info.name}
Email: ${info.email}
Website: ${info.website}`
    const mailto = `mailto:stellarbroker@stellar.expert?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    return <div className="w-100" style={{maxWidth: '25em'}}>
        <div className="nano-space strong">Tell us about yourself</div>
        <p className="dimmed text-tiny">
            Please share your contact information so we could reach you and prepare the contract agreement.
        </p>
        <div className="space"/>
        <div className="micro-space">
            <p className="label text-small">Company name</p>
            <input value={info?.name || ''} onChange={changeName} className="styled-input"/>
        </div>
        <div className="micro-space">
            <p className="label text-small">Contact email address</p>
            <input value={info?.email || ''} onChange={changeEmail} className="styled-input"/>
        </div>
        <div className="micro-space">
            <p className="label text-small">Website</p>
            <input value={info?.website || ''} onChange={changeWebsite} className="styled-input"/>
        </div>
        <div className="space">
            <Button block disabled={!isValid} href={mailto}>Request Access</Button>
        </div>
    </div>
}

export default RequestAccessForm