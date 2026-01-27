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

const network = WalletNetwork.PUBLIC

const kit = new StellarWalletsKit({
    network,
    theme: ModalThemes.DARK,
    selectedWalletId: ALBEDO_ID,
    modules: [
        ...allowAllModules(),
        new WalletConnectModule({
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
    const {signedTxXdr} = await kit.signTransaction(tx.toXDR())
    return TransactionBuilder.fromXDR(signedTxXdr, Networks.PUBLIC)
}

export function setWallet(walletId) {
    kit.setWallet(walletId)
}

export async function isConnected(account) {
    try {
        const usedWalletsIds = JSON.parse(localStorage.getItem('@StellarWalletsKit/usedWalletsIds') || '')
        if (usedWalletsIds[0] !== 'wallet_connect')
            return true
        //create session WalletConnect
        const {address} = await kit.getAddress()
        return address === account
    } catch (e) {
        notify({type: 'error', message: e.message})
        return false
    }
}