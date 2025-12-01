import {Networks, TransactionBuilder} from '@stellar/stellar-sdk'
import {
    StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    ALBEDO_ID,
    ModalThemes
} from '@creit.tech/stellar-wallets-kit'

const network = WalletNetwork.PUBLIC

const kit = new StellarWalletsKit({
    network,
    theme: ModalThemes.DARK,
    selectedWalletId: ALBEDO_ID,
    modules: allowAllModules()
})

let connected

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
                    connected = {kit, address}
                    resolve(connected)
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