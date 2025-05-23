import React, {useCallback, useEffect, useState} from 'react'
import {StrKey} from '@stellar/stellar-sdk'
import {fromStroops} from '@stellar-expert/formatter'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {usePartnerSettings} from '../../utils/hooks/partner-settings'
import {Button} from '../../components/ui/button'
import {Loader} from '../../components/ui/loader'
import {performApiCall} from '../../api/api-call'

function validate({address, amount} = {}) {
    return StrKey.isValidEd25519PublicKey(address) && amount > 0
}

export default function WithdrawFormView() {
    const [payout, setPayout] = useState({})
    const [isValid, setIsValid] = useState(false)
    const [available, setAvailable] = useState(undefined)
    const [counter, setCounter] = useState(0)

    const setAvailableAmount = useCallback(available => {
        const amount = fromStroops(available)
        setPayout(prev => ({...prev, amount}))
        setAvailable(amount)
    }, [setPayout])

    const refresh = useCallback(() => setCounter(prev => prev + 1), [])

    useEffect(() => {
        performApiCall('partner/earned')
            .then(result => {
                if (result.error) {
                    console.error(result.error)
                    return notify({type: 'error', message: 'Failed to retrieve available earning amount.'})
                }
                setAvailableAmount(BigInt(result.amount))
            })
    }, [setAvailableAmount, counter])

    //refresh available earning every 5 minutes
    useEffect(() => {
        const interval = setInterval(refresh, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    const changeAmount = useCallback(e => {
        const amount = e.target.value.trim().replace(/[^\d.]/g, '')
        setPayout(prev => {
            const newPayout = {...prev, amount}
            setIsValid(validate(newPayout))
            return newPayout
        })
    }, [])

    const changeAddress = useCallback(e => {
        const address = e.target.value.trim()
        setPayout(prev => {
            const newPayout = {...prev, address}
            setIsValid(validate(newPayout))
            return newPayout
        })
    }, [])

    const withdrawEarnings = () => {
        if (!isValid)
            return
        performApiCall('partner/withdraw', {method: 'POST', params: payout})
            .then(() => {
                notify({type: 'info', message: 'Payout transaction has been submitted'})
                refresh()
            }) //TODO: check status
    }

    if (available === undefined)
        return <Loader/>
    return <div>
        <div className="row">
            <div className="column column-33">
                <div className="micro-space">
                    <p className="label">Withdrawal amount (USDC)</p>
                    <input ref={useAutoFocusRef} value={payout.amount || ''} onChange={changeAmount} className="styled-input nano-space"/>
                    <div className="text-tiny dimmed-light">Available for withdrawal:&nbsp;
                        <a href="#" onClick={setAvailableAmount}>{available} USDC</a>
                    </div>
                </div>
            </div>
            <div className="column column-66">
                <div className="micro-space">
                    <p className="label">Account address</p>
                    <input value={payout.address || ''} onChange={changeAddress}
                           className="styled-input" placeholder='Stellar address (Starts with "G")'/>
                </div>
            </div>
            <div className="column column-33 column-offset-66 text-right">
                <div className="space"/>
                <Button disabled={!isValid} onClick={withdrawEarnings}>Request withdrawal</Button>
            </div>
        </div>
    </div>
}