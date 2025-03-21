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
        <div className="micro-space">Available for withdrawal: <b className="font-mono">{fromStroops(partnerInfo.fees)}</b> USDC</div>
        <div className="row">
            <div className="column column-66">
                <div className="space">
                    <p className="label text-small">Account address</p>
                    <input ref={useAutoFocusRef} value={payout.address || ''} onChange={changeAddress} className="styled-input"/>
                </div>
            </div>
            <div className="column column-33">
                <div className="space">
                    <p className="label text-small">Withdrawal amount (USDC)</p>
                    <input value={payout.amount || ''} onChange={changeAmount} className="styled-input text-right"/>
                </div>
            </div>
            <div className="column column-33 column-offset-66 text-right">
                <div className="label-space"/>
                <Button block disabled onClick={withdrawEarnings}>Request withdrawal</Button>
            </div>
        </div>
    </div>
}