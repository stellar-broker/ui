import React, {useCallback, useState} from 'react'
import {useAutoFocusRef} from '../../utils/hooks/auto-focus-ref'
import {Button} from '../../components/ui/button'

function WithdrawForm() {
    const [payout, setPayout] = useState({})

    const changeAmount = useCallback(e => {
        setPayout(prev => ({ ...prev, amount: e.target.value }))
    }, [])

    const changeAddress = useCallback(e => {
        setPayout(prev => ({ ...prev, address: e.target.value }))
    }, [])

    const withdrawEarnings = useCallback(() => {

    }, [])

    return <div className="row">
        <div className="column column-50">
            <div className="space">
                <p className="label text-small">Account address</p>
                <input ref={useAutoFocusRef} value={payout.address || ''} onChange={changeAddress} className="styled-input"/>
            </div>
        </div>
        <div className="column column-50">
            <div className="space">
                <p className="label text-small">Withdraw amount (USDC)</p>
                <input value={payout.amount || ''} onChange={changeAmount} className="styled-input"/>
            </div>
        </div>
        <div className="column column-33 column-offset-66 text-right">
            <div className="label-space"/>
            <Button block disabled onClick={withdrawEarnings}>Withdraw</Button>
        </div>
    </div>
}

export default WithdrawForm