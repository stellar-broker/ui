import {Networks, TransactionBuilder} from '@stellar/stellar-sdk'
import {
    StellarWalletsKit,
    WalletNetwork,
    FreighterModule,
    AlbedoModule,
    LobstrModule,
    xBullModule,
    ALBEDO_ID,
    ModalThemes
} from '@creit.tech/stellar-wallets-kit'

const network = WalletNetwork.PUBLIC

const kit = new StellarWalletsKit({
    network,
    theme: ModalThemes.DARK,
    selectedWalletId: ALBEDO_ID,
    modules: [
        new AlbedoModule(),
        new FreighterModule(),
        new LobstrModule(),
        new xBullModule()
    ]
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
                    connected = {kit, address}
                    resolve(connected)
                } catch (e) {
                    notify({type: 'error', message: e.message})
                }
            }
        })
    })
}

export async function signTx(tx) {
    const {signedTxXdr} = await kit.signTransaction(tx.toXDR())
    return TransactionBuilder.fromXDR(signedTxXdr, Networks.PUBLIC)
}