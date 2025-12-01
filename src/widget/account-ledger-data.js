import {parseAssetFromObject} from '@stellar-expert/asset-descriptor'
import {toStroops, fromStroops} from '@stellar-expert/formatter'

/**
 * On-chain account balances.
 */
class AccountLedgerData {
    constructor() {
        this.pendingLiabilities = {}
        this.balances = {}
    }

    /**
     * Stellar account public key
     * @type {String}
     */
    address = ''

    /**
     * Account data obtained from Horizon
     * @type {AccountResponse}
     */
    accountData

    /**
     * Current account balances
     * @type {{}}
     */
    balances

    /**
     * @type {{}[]}
     */
    balancesWithPriority

    /**
     * Liabilities in pending transactions
     * @type {{}}
     */
    pendingLiabilities

    error

    nonExisting = false

    loaded = false

    init(address) {
        this.address = address
        this.reset()
        this.loadAccountInfo()
    }

    reset() {
        this.balances = {}
        this.nonExisting = false
        this.error = undefined
        this.loaded = false
    }

    /**
     * Load general account info from the ledger
     */
    async loadAccountInfo() {
        await fetchAccountHorizonData(this.address)
            .then((accountData = {}) => {
                if (accountData.error) {
                    this.reset()
                    this.error = accountData.error
                    this.nonExisting = accountData.nonExisting
                } else {
                    this.accountData = accountData
                    this.balances = accountData.balancesMap
                    this.balancesWithPriority = [...Object.values(this.balances)]
                    this.balancesWithPriority.sort((a, b) => {
                        if (a.asset_type === 'native') return -1
                        if (a.balance == 0 && b.balance > 0) return 1
                        if (b.balance == 0 && a.balance > 0) return -1
                        if (a.asset_code === b.asset_code) return a.balance - b.balance
                        return (a.asset_code > b.asset_code) ? 1 : (a.asset_code < b.asset_code) ? -1 : 0
                    })
                    this.pendingLiabilities = {} //reset after each account info update
                    this.nonExisting = false
                    this.error = null
                }
                this.loaded = true
            })
    }

    /**
     * Get asset amount available for trade/transfer with respect to liabilities and reserves
     * @param {String} asset - Asset identifier
     * @param {Number|String} [additionalReserves] - Additional reserves required for the wallet operation
     * @return {String}
     */
    getAvailableBalance(asset, additionalReserves = 0) {
        if (!additionalReserves && asset === 'XLM') {
            additionalReserves = 0.2
        }
        const trustline = this.getTrustline(asset)
        if (!trustline)
            return '0'
        return calculateAvailableBalance(this.accountData, trustline, additionalReserves)
    }

    getTrustline(asset) {
        if (!asset)
            return undefined
        if (asset.toFQAN) {
            asset = asset.toFQAN()
        }
        return this.balances[asset]
    }
}

export default new AccountLedgerData()

async function fetchAccountHorizonData(address) {
    try {
        const accountData = await fetch('https://horizon.stellar.org/accounts/' + address)
            .then(res => res.json())
        const balances = {}
        for (let balance of accountData.balances) {
            const id = parseAssetFromObject(balance).toFQAN()
            balance.id = id
            balances[id] = balance
        }
        accountData.balancesMap = balances
        return accountData
    } catch (e) {
        let nonExisting = false,
            error
        if (e.name === 'NotFoundError') {
            error = 'Account does not exist on the ledger'
            nonExisting = true
        } else {
            console.error(e)
            error = 'Failed to load account data from Horizon'
        }
        return {error, nonExisting}
    }
}

/**
 * Calculate available balance for a given account balance trustline
 * @param {AccountResponse} account
 * @param {Horizon.BalanceLine} balance
 * @param {Number} [additionalReserves]
 * @return {String}
 */
function calculateAvailableBalance(account, balance, additionalReserves = null) {
    let available = toStroops(balance.balance) - toStroops(balance.selling_liabilities || 0)
    if (balance.asset_type === 'native') {
        const reserves = 2 + account.subentry_count + account.num_sponsoring - account.num_sponsored
        available = available - (BigInt(reserves) * 5000000n)
    }
    if (additionalReserves !== null) {
        available = available - toStroops(additionalReserves)
    }
    return fromStroops(available)
}