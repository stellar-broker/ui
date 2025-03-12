import React, {useCallback, useState} from 'react'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {Button} from '../../components/ui/button'

export default function WithdrawForm() {
    const [payout, setPayout] = useState({})

    const changeAmount = useCallback(e => {
        setPayout(prev => ({...prev, amount: e.target.value}))
    }, [])

    const changeAddress = useCallback(e => {
        setPayout(prev => ({...prev, address: e.target.value}))
    }, [])

    const withdrawEarnings = useCallback(() => {

    }, [])

    return <div>
        <div className="micro-space">Available for withdrawal: <b className="font-mono">0</b> USDC</div>
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