import {debounce} from 'throttle-debounce'
import {Asset, Keypair} from '@stellar/stellar-sdk'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {fromStroops, toStroops} from '@stellar-expert/formatter'
import {Mediator, StellarBrokerClient} from '@stellar-broker/client'
import {signTx} from './wallet-kit'
import accountLedgerData from './account-ledger-data'

const partnerKey = '8h4giZyS7ydJKfN7C2uZGUDevkxdPr5gpJHF39M1wSJhWRoqCgDQw7a85mhmG4zSAX'
const dummyBrokerAccount = 'GBW7T3IVZWUF5AEUYUFG5FXBFJNEJCJYEMCG23NIZI36CNUBOPLDKBPA'
const MEDIATOR_FEE_RESERVE = 5

export default class SwapWidgetSettings {
    constructor(onUpdate) {
        this.asset = ['XLM', 'XLM']
        this.amount = ['0', '0']
        this.conversionSlippage = 1
        this.fee = 'normal'
        if (!onUpdate)
            return
        this.connectToBroker()
            .catch(e => console.error(e))
        this.updateQuote = debounce(800, this.updateQuote.bind(this))
        this.onUpdate = onUpdate
    }

    /**
     * @type {StellarBrokerClient}
     */
    brokerClient
    /**
     * @type {[String]}
     */
    asset
    /**
     * @type {[String]}
     */
    amount
    /**
     * @type {Number}
     */
    conversionSlippage
    /**
     * @type {String}
     */
    conversionPrice
    /**
     * @type {Boolean}
     */
    conversionFeasible
    /**
     * @type {Asset[]}
     */
    conversionPath
    /**
     * @type {Boolean}
     */
    conversionPathLoaded = false
    /**
     * @type {Number | String}
     */
    fee
    /**
     * @type {String}
     */
    validationStatus
    /**
     * @type {{}}
     */
    quote

    message

    errorMessage

    inProgress

    isFinished

    get isValid() {
        return !this.validationStatus
    }

    async connectToBroker() {
        const client = new StellarBrokerClient({
            partnerKey,
            account: dummyBrokerAccount
        })
        client.on('error', e => {
            this.inProgress = false
            this.isFinished = true
            this.errorMessage = e.error
            this.onUpdate()
        })
        client.on('paused', e => {
            this.message = 'Quotation paused.'
            this.onUpdate()
        })
        //subscribe to the quote notifications
        client.on('quote', e => {
            if (e.quote.directTrade) {
                this.conversionPath = e.quote.directTrade.path.map(a => {
                    if (a === 'XLM')
                        return Asset.native()
                    const [code, issuer] = a.split('-')
                    return new Asset(code, issuer)
                })
            }

            this.quote = e.quote

            const estimated = parseFloat(e.quote.directTrade?.buying) > parseFloat(e.quote.estimatedBuyingAmount) ?
                this.quote.directTrade.buying :
                this.quote.estimatedBuyingAmount
            this.amount[1] = withSlippage(estimated, this.conversionSlippage)
            this.profit = e.quote.profit
            this.conversionPathLoaded = true
            this.conversionFeasible = e.quote.status === 'success' || !!e.quote.directTrade
            this.onUpdate()
        })
        client.on('finished', e => {
            console.log('Trade finished', e.result)
            const tradeResult = `${e.result.sold} ${this.quote.sellingAsset.split('-')[0]} → ${e.result.bought} ${this.quote.buyingAsset.split('-')[0]}`
            switch (e.result.status) {
                case 'success':
                    notify({type: 'success', message: 'Success! Swapped ' + tradeResult})
                    break
                case 'cancelled':
                    if (parseFloat(e.result.sold) > 0) {
                        notify({type: 'warning', message: 'Swap executed partially: ' + tradeResult})
                    } else {
                        notify({type: 'info', message: 'Swap cancelled'})
                    }
                    break
            }
            this.resetOperationAmount()
            this.refreshBalances()
            this.inProgress = false
            this.isFinished = true
            this.onUpdate()
        })
        client.on('progress', e => {
            console.log('Progress', e.status)
            if (parseFloat(e.status.bought) > parseFloat(this.bought || 0)) { //TODO: calculate and show percentage
                this.refreshBalances()
            }
            this.bought = e.status.bought
        })
        this.brokerClient = client
        //connect...
        await client.connect()
    }

    /**
     * Set transfer tokens amount
     * @param {String} amount
     * @param {Number} index
     */
    setAmount(amount) {
        this.amount[0] = amount
        this.recalculateSwap()
    }

    /**
     * Maximum allowed price slippage
     * @param {Number | String} slippage
     */
    setSlippage(slippage) {
        this.conversionSlippage = parseFloat(slippage)
        this.recalculateSwap()
    }

    /**
     * Update fee
     * @param {Number | String} fee
     */
    setFee(fee) {
        this.fee = fee
        this.recalculateSwap()
    }

    /**
     * Update assets
     * @param {String|AssetDescriptor} asset
     */
    setSellingAsset(asset) {
        this.asset[0] = asset
        this.recalculateSwap()
    }

    /**
     * Update assets
     * @param {String|AssetDescriptor} asset
     */
    setBuyingAsset(asset) {
        this.asset[1] = asset
        this.recalculateSwap()
    }

    /**
     * Estimate swap price and amount
     */
    recalculateSwap() {
        this.conversionPath = undefined
        this.conversionPrice = undefined
        this.conversionFeasible = false
        this.conversionPathLoaded = false
        this.message = undefined
        this.errorMessage = undefined
        this.profit = undefined
        this.amount[1] = ''
        this.isFinished = false
        this.inProgress = false
        this.validationStatus = validateSwap(this)
        this.onUpdate()
        this.updateQuote()
    }

    updateQuote() {
        if (!this.isValid) {
            this.brokerClient.stop()
            return
        }

        this.brokerClient.quote({
            sellingAsset: this.asset[0],
            buyingAsset: this.asset[1],
            sellingAmount: this.amount[0] || undefined,
            slippageTolerance: this.conversionSlippage / 100
        })
    }

    /**
     * Confirm swap
     * @return {Promise}
     */
    async confirmSwap(address) {
        let mediator
        try {
            mediator = new Mediator(
                address,
                this.asset[0],
                this.asset[1],
                this.amount[0] || undefined,
                this.signSwapTx,
                MEDIATOR_FEE_RESERVE
            )
            const secret = await mediator.init()
            await this.confirmQuote(secret)
        } catch (error) {
            notify({type: 'error', message: error.message})
            this.inProgress = false
            this.onUpdate('ready')
        }
        return this.finishSwap(mediator)
    }

    async confirmQuote(secret) {
        const kp = Keypair.fromSecret(secret)

        const signTx = async payload => {
            if (payload.sign) {
                payload.sign(kp)
                return payload
            }
            return kp.sign(payload)
        }

        await this.brokerClient.confirmQuote(kp.publicKey(), signTx)
    }

    finishSwap(mediator) {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (this.isFinished) return resolve() //immediately finish the swap
            }, 1000)
            setTimeout(() => reject('timeout'), 60 * 1000)
        })
            .then(result => result)
            .catch(e => {
                if (e === 'timeout') {
                    notify({
                        type: 'warning',
                        message: 'Timed out, your funds will be returned in a few seconds, please wait'
                    })
                } else {
                    console.error(e)
                    notify({type: 'warning', message: 'Failed to execute swap, please try again later'})
                }
            })
            .finally(() => setTimeout(() => this.dispose(mediator), 2000))
    }

    /**
     * Set amounts to zero
     */
    resetOperationAmount() {
        this.amount = ['0', '0']
        this.setAmount('0')
    }

    /**
     * Refresh connected account balances
     */
    async refreshBalances() {
        await accountLedgerData.loadAccountInfo()
            .finally(() => this.onUpdate())
    }

    signSwapTx = async (tx) => {
        this.onUpdate('confirmation')
        const signedTx = await signTx(tx)
        this.inProgress = true
        this.onUpdate('ready')
        notify({type: 'info', message: 'Swapping, please do not leave this page'})
        return signedTx
    }

    async dispose(mediator) {
        try {
            this.brokerClient.stop()
            await mediator.dispose()
            await this.refreshBalances()
        } catch (e) {
            console.error(e)
        }
        this.brokerClient?.close()
    }
}

function withSlippage(amount, slippage) {
    if (!slippage)
        return amount
    return fromStroops(BigInt((1 - slippage / 100) * 100000000) * toStroops(amount) / 100000000n)
}

function validateSwap(swap) {
    if (!swap.asset[1] || swap.asset[0] === swap.asset[1] || (!parseFloat(swap.amount[0]) && !parseFloat(swap.amount[1])))
        return 'missing_parameters'
}