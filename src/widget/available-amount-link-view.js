import React, {useEffect, useState} from 'react'
import {formatWithAutoPrecision, fromStroops, toStroops} from '@stellar-expert/formatter'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import accountLedgerData from './account-ledger-data'

export default function AvailableAmountLink({settings}) {
    const asset = settings.asset[0]
    const [availableBalance, setAvailableBalance] = useState(getBalance(asset))

    useEffect(() => {
        setAvailableBalance(getBalance(asset))
    }, [accountLedgerData.balances[asset]])

    function setAmount(e) {
        const percentage = BigInt(e.target.dataset.balance)
        let amount = availableBalance
        if (percentage !== 100n) {
            amount = fromStroops(toStroops(availableBalance) * percentage / 100n)
        }
        settings.setAmount(amount)
    }

    return <div className="dimmed condensed text-tiny text-right">
        <a className="dimmed" href="#" onClick={setAmount} data-balance={100}>
            {formatWithAutoPrecision(availableBalance)} {AssetDescriptor.parse(asset).toCurrency()}
        </a>&emsp;
        <a href="#" onClick={setAmount} data-balance={25}>25%</a>{' / '}
        <a href="#" onClick={setAmount} data-balance={50}>50%</a>
        <span className="desktop-only">{' / '}
            <a href="#" onClick={setAmount} data-balance={100}>100%</a>
        </span>
    </div>
}

function getBalance(asset) {
    const res = accountLedgerData.getAvailableBalance(asset,  asset === 'XLM' ? 1 : 0)
    if (parseFloat(res) < 0)
        return '0'
    return res
}