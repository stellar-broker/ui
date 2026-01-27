import React, {useCallback} from 'react'
import {AccountAddress} from '../components/ui'
import {connectWalletsKit} from './wallet-kit'
import accountLedgerData from './account-ledger-data'

export default function ConnectWalletView() {
    const connectWallet = useCallback(() => {
        connectWallets()
            .catch(() => {
            })
    }, [])

    if (!accountLedgerData.address)
        return null

    return <a href="#" onClick={connectWallet}>
        <AccountAddress address={accountLedgerData.address} chars={8} link={false} className="dimmed text-tiny"/>
    </a>
}

export async function connectWallets() {
    return await connectWalletsKit()
        .then(connect => {
            if (!connect)
                throw Error('Failed to connect wallet')
            accountLedgerData.init(connect.address)
            notify({type: 'info', message: 'Great! Now you can swap with StellarBroker!'})
        })
}