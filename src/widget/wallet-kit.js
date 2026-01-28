import {Networks, TransactionBuilder} from '@stellar/stellar-sdk'
import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    ALBEDO_ID,
    ModalThemes
} from '@creit.tech/stellar-wallets-kit'
import {
    WalletConnectAllowedMethods,
    WalletConnectModule
} from '@creit.tech/stellar-wallets-kit/modules/walletconnect.module.mjs'
import accountLedgerData from './account-ledger-data'

const network = WalletNetwork.PUBLIC

const kit = new StellarWalletsKit({
    network,
    theme: ModalThemes.DARK,
    selectedWalletId: ALBEDO_ID,
    modules: [
        ...allowAllModules(),
        new WalletConnectModule({
            url: 'https://stellar.broker',
            projectId: 'f7e12b9f871e5da52e5faa88ff7b5d30',
            method: WalletConnectAllowedMethods.SIGN,
            network,
            name: 'StellarBroker',
            description: `Multi-source liquidity swap router for Stellar, providing access to AMMs and Stellar DEX.`,
            icons: [
                'https://stellar.broker/img/stellar-broker-logo+text-v1.png'
            ]
        })
    ]
})

/**
 * @return {Promise<{address: string, kit: StellarWalletsKit}>}
 */
export function connectWalletsKit() {
    return new Promise((resolve, reject) => {
        kit.openModal({
            onWalletSelected: async (selected) => {
                try {
                    kit.setWallet(selected.id)
                    const {address} = await kit.getAddress()
                    localStorage.setItem('activeAccount', address)
                    resolve({kit, address})
                } catch (e) {
                    reject(e)
                    notify({type: 'error', message: e.message})
                }
            },
            onClosed: () => resolve(null)
        })
    })
}

export async function signTx(tx) {
    const {signedTxXdr} = await kit.signTransaction(tx.toXDR(), {
        address: accountLedgerData.address,
        networkPassphrase: network
    })
    return TransactionBuilder.fromXDR(signedTxXdr, Networks.PUBLIC)
}

export function setWallet(walletId) {
    kit.setWallet(walletId)
}