import {Networks, TransactionBuilder} from '@stellar/stellar-sdk'
import {StellarWalletsKit} from "@creit-tech/stellar-wallets-kit"
import {defaultModules} from '@creit-tech/stellar-wallets-kit/modules/utils'
import {WalletConnectModule} from '@creit-tech/stellar-wallets-kit/modules/wallet-connect'

StellarWalletsKit.init({
    modules: [
        ...defaultModules(),
        new WalletConnectModule({
            projectId: "f7e12b9f871e5da52e5faa88ff7b5d30",
            metadata: {
                name: "StellarBroker",
                description: "StellarBroker - Multi-source liquidity swap router for Stellar, providing access to AMMs and Stellar DEX",
                icons: ["/img/stellar-broker-logo+text-v1.png"],
                url: location.href
            }
        })
    ]
})

export async function signTx(tx) {
    const {signedTxXdr} = await StellarWalletsKit.signTransaction(tx.toXDR())
    return TransactionBuilder.fromXDR(signedTxXdr, Networks.PUBLIC)
}