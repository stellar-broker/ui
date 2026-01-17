import React, {useCallback, useEffect, useState} from 'react'
import {formatWithAutoPrecision, fromStroops, toStroops} from '@stellar-expert/formatter'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import accountLedgerData from './account-ledger-data'

export default function AvailableAmountLink({settings}) {
    const asset = settings.asset[0]
    const [availableBalance, setAvailableBalance] = useState(getBalance(asset))

    useEffect(() => {
        setAvailableBalance(getBalance(asset))
    }, [accountLedgerData.balances[asset]])

    const setAmount = useCallback(() => {
        settings.setAmount(availableBalance)
    }, [settings, availableBalance])

    if (!accountLedgerData.loaded)
        return null

    return <div className="dimmed condensed text-tiny" style={{float: 'right'}}>
        <a className="dimmed" href="#" onClick={setAmount} data-balance={100}>
            {formatWithAutoPrecision(availableBalance)} {AssetDescriptor.parse(asset).toCurrency()}&nbsp;available
        </a>
    </div>
}

function getBalance(asset) {
    const res = accountLedgerData.getAvailableBalance(asset, asset === 'XLM' ? 1 : 0)
    if (parseFloat(res) < 0)
        return '0'
    return res
}