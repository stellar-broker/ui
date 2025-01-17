import {debounce} from 'throttle-debounce'
import {Horizon} from '@stellar/stellar-sdk'
import {Asset, Keypair, TransactionBuilder, Networks} from '@stellar/stellar-base'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {fromStroops, toStroops} from '@stellar-expert/formatter'
import StellarBroker from '@stellar-broker/client'

export default class SwapWidgetSettings {
    constructor(onUpdate) {
        this.asset = ['XLM', 'XLM']
        this.amount = ['0', '0']
        this.conversionSlippage = 0
        this.fee = 'normal'
        if (!onUpdate)
            return
        this.connectToBroker()
            .catch(e => console.error(e))
        this.updateQuote = debounce(800, this.updateQuote.bind(this))
        this.onUpdate = onUpdate
    }

    /**
     * @type {StellarBroker}
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

    get isValid() {
        return !this.validationStatus
    }

    async connectToBroker() {
        const client = new StellarBroker({
            partnerKey: '5Z1F4hiq1bGL1JKYnGXFojhg1bmjQTdPjLowJySVuEX7ajx1Xszr9yMQXN6m8ZCRdo',
            account: 'GBW7T3IVZWUF5AEUYUFG5FXBFJNEJCJYEMCG23NIZI36CNUBOPLDKBPA',
            authorization: payload => {
                throw new Error('Not implemented')
            }
        })
        client.on('error', e => {
            this.message = e.error
            this.onUpdate()
        })
        client.on('paused', e => {
            this.message = 'Quotation paused. Change parameters to continue.'
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
            this.direct = e.quote.directTrade?.buying
            this.conversionPathLoaded = true
            this.conversionFeasible = e.quote.status === 'success' || !!e.quote.directTrade
            this.onUpdate()
        })
        client.on('finished', e => {
            console.log('Trade finished', e.result)
            const tradeResult = `${e.result.sold} ${this.quote.sellingAsset.split('-')[0]} → ${e.result.bought} ${this.quote.buyingAsset.split('-')[0]}`
            switch (e.result.status) {
                case 'success':
                    notify({type: 'success', message: 'Swapped ' + tradeResult})
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
            refreshBalances()
        })
        client.on('progress', e => {
            console.log('Progress', e.status)
            if (parseFloat(e.status.bought) > parseFloat(this.bought || 0)) { //TODO: calculate and show percentage
                refreshBalances()
            }
            this.bought = e.status.bought
        })
        this.brokerClient = client
        //connect...
        await client.connect()
        console.log('Connected to StellarBroker')
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
     * @param {Number} slippage
     */
    setSlippage(slippage) {
        this.conversionSlippage = slippage
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
        this.direct = undefined
        this.amount[1] = ''
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
     * Set amounts to zero
     */
    resetOperationAmount() {
        this.amount = ['0', '0']
        this.setAmount('0')
    }

    async confirmSwap() {
        this.brokerClient.confirmQuote()
    }

    dispose() {
        try {
            this.brokerClient.stop()
        } catch (e) {
        }
        this.brokerClient?.close()
    }
}

function withSlippage(amount, slippage) {
    if (!slippage)
        return amount
    return fromStroops(BigInt((1 - slippage / 100) * 100000000) * toStroops(amount) / 100000000n)
}

function refreshBalances() {

}

function validateSwap(swap) {
    if (!swap.asset[1] || swap.asset[0] === swap.asset[1] || (!parseFloat(swap.amount[0]) && !parseFloat(swap.amount[1])))
        return 'missing_parameters'
}