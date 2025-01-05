import {useCallback, useState} from 'react'
import {Button} from './ui/button'

function validation({name, email, messenger, fee}) {
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    return emailRegex.test(email) && !!name && !!messenger && !!fee
}

function RequestAccessForm({step, updateStep, stepAmount}) {
    const [info, setInfo] = useState({})
    const [isValid, setIsValid] = useState(false)

    const changeName = useCallback(e => {
        const val = e.target.value.trim()
        setInfo(prev => ({...prev, ['name']: val}))
        setIsValid(!!val)
    }, [])

    const changeEmail = useCallback(e => {
        const val = e.target.value.trim()
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        setInfo(prev => ({...prev, ['email']: val}))
        setIsValid(emailRegex.test(val))
    }, [])

    const changeWebsite = useCallback(e => {
        const val = e.target.value.trim()
        setInfo(prev => ({...prev, ['website']: val}))
        setIsValid(!!val)
    }, [])

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
            <Button block href={mailto}>Request Access</Button>
        </div>
    </div>
}

export default RequestAccessForm