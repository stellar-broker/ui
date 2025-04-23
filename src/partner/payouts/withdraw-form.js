import React, {useCallback, useEffect, useState} from 'react'
import {StrKey} from '@stellar/stellar-sdk'
import {fromStroops} from '@stellar-expert/formatter'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {performApiCall} from '../../api/api-call'
import {Button} from '../../components/ui/button'
import {Loader} from '../../components/ui/loader'

function validate({address, amount} = {}) {
    return StrKey.isValidEd25519PublicKey(address) && amount > 0
}

export default function WithdrawForm() {
    const [payout, setPayout] = useState({})
    const [partnerInfo, setPartnerInfo] = useState()
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        performApiCall('partner/info')
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partners settings. ' + result.error})
                setPartnerInfo(result)
            })
    }, [])

    const setAvailableAmount = useCallback(() => {
        setPayout(prev => ({...prev, amount: fromStroops(partnerInfo.fees)}))
    }, [partnerInfo])

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

    const withdrawEarnings = useCallback(() => {

    }, [])

    if (!partnerInfo)
        return <Loader/>
    return <div>
        <div className="row">
            <div className="column column-33">
                <div className="micro-space">
                    <p className="label">Withdrawal amount (USDC)</p>
                    <input ref={useAutoFocusRef} value={payout.amount || ''} onChange={changeAmount} className="styled-input nano-space"/>
                    <div className="text-tiny dimmed-light">Available for withdrawal:&nbsp;
                        <a href="#" onClick={setAvailableAmount}>{fromStroops(partnerInfo.fees)} USDC</a>
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