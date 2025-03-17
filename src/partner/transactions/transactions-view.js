import {useCallback, useState} from 'react'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {fromStroops, formatDateUTC} from '@stellar-expert/formatter'
import {usePaginatedApi} from '../../utils/hooks/paginated-list-hooks'
import {navigation} from '../../utils/navigation'
import {useAssetMeta} from '../../utils/hooks/asset-meta-hook'
import {AssetIcon} from '../../components/ui/asset-link'
import {Button} from '../../components/ui/button'
import {Loader} from '../../components/ui/loader'
import {Amount} from '../../components/ui/amount'
import './transactions-view.scss'

function parseAsset(asset) {
    const [code, issuer] = asset.split('-')
    return {
        asset,
        code,
        issuer
    }
}

export default function TransactionsView({compact, endpoint = 'partner/swaps'}) {
    const transactions = usePaginatedApi(
        {
            path: endpoint,
            query: {
                cursor: navigation.query.cursor,
                search: navigation.query.search
            }
        }, {
            autoReverseRecordsOrder: true,
            limit: compact ? 10 : 20,
            defaultQueryParams: {order: 'desc'}
        })

    const navigate = useCallback((page) => {
        transactions.load(page)
    }, [])

    if (!transactions.loaded)
        return <Loader/>

    return <div>
        <div className="table space swaps-history">
            {!!compact && <div className="table-header">
                <h5>Swap history</h5>
            </div>}
            <table>
                <thead className="text-tiny dimmed">
                <tr>
                    <th>Pair</th>
                    <th>Sell</th>
                    <th>Fees</th>
                    <th className="desktop-center">Status</th>
                    <th className="desktop-right">Date</th>
                    <th className="collapsing text-right">&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                {transactions.data?.map(swap => <SwapRecord swap={swap} key={swap.paging_token}/>)}
                </tbody>
            </table>
            {!transactions.data.length && <p className="empty-data">You have not made any transactions yet</p>}
        </div>
        {!compact && <div className="button-group space text-center">
            <Button small disabled={transactions.loading || !transactions.canLoadPrevPage} onClick={() => navigate(-1)}>Prev Page</Button>
            <Button small disabled={transactions.loading || !transactions.canLoadNextPage} onClick={() => navigate(1)}>Next Page</Button>
        </div>}
    </div>
}

function SwapRecord({swap}) {
    const [expanded, setExpanded] = useState(false)
    const pair = [parseAsset(swap.sellingAsset), parseAsset(swap.buyingAsset)]
    const date = formatDateUTC(swap.created)
    const totalFees = swap.trades.reduce((acc, trade) => acc + BigInt(trade.fee || 0), 0n)
    const status = getSwapStatus(swap)
    const toggleExpanded = useCallback(() => setExpanded(prev => !prev), [setExpanded])
    return <>
        <tr>
            <td data-header="Pair: ">
                <AssetPair pair={pair}/>
            </td>
            <td data-header="Sell: ">
                <span className="font-mono">
                    <Amount amount={swap.sellingAmount} asset={swap.sellingAsset} adjust issuer={false}/>
                </span>
            </td>
            <td data-header="Fees: ">
                <span className="font-mono condensed">
                {totalFees > 0n ? '$' + fromStroops(totalFees) : '-'}
                </span>
            </td>
            <td className="desktop-center" data-header="Status: ">
                <span title={swapStatusInfo[status].info}>{status}</span>
            </td>
            <td className="desktop-right" data-header="Date: ">{formatDateUTC(date)}</td>
            <td>
                <a href="#" className={expanded ? 'icon-less' : 'icon-more'} title="Show details" onClick={toggleExpanded}>
                    <span className="mobile-only">Show details</span>
                </a>
            </td>
        </tr>
        {expanded && <tr className="details text-small">
            <td colSpan="6" style={{paddingLeft: '4em'}}>
                <div>
                    Quote estimated amount:{' '}
                    {swap.quote.estimatedBuyingAmount ?
                        <Amount amount={swap.quote.estimatedBuyingAmount} asset={swap.buyingAsset} adjust issuer={false}/> :
                        'N/A'
                    }, slippage tolerance: {swap.quote.slippageTolerance * 100}%
                </div>
                <div className="nano-space"/>
                {swap.trades.map(trade => <div key={trade.id}>
                    <i className="icon-angle-double-right"/>
                    <Amount amount={trade.sold || trade.estimatedSold} asset={swap.sellingAsset} adjust issuer={false}/>
                    {' '}<i className="icon-swap"/>{' '}
                    <Amount amount={trade.bought || trade.estimatedBought} asset={swap.buyingAsset} adjust issuer={false}/>
                    {!!trade.fee && <> (fee
                        ${fromStroops(trade.fee)})</>} - <span className="dimmed">{decodeTradeStatus(trade.status)}</span>
                    &emsp;
                    {trade.status === 'success' || trade.status === 'failed' ?
                        <a href={`https://stellar.expert/explorer/public/tx/${trade.tx}`} target="_blank"
                           title="View transaction details">
                            {formatDateUTC(trade.created)} <i className="icon-open-new-window"/></a> :
                        <span className="dimmed">{formatDateUTC(trade.created)}</span>
                    }
                </div>)}
            </td>
        </tr>}
    </>
}

function getSwapStatus(swap) {
    if (!swap.trades.length)
        return 'dropped'
    const totalSold = swap.trades.filter(trade => trade.status === 'success').reduce((acc, trade) => acc + BigInt(trade.sold), 0n)
    if (totalSold > 0n) {
        if (totalSold < BigInt(swap.sellingAmount))
            return 'partial'
        return 'success'
    }
    if (swap.trades.some(trade => trade.status === 'failed'))
        return 'failed'
    return 'unconfirmed'
}

const swapStatusInfo = {
    dropped: {
        info: 'Either connection with a client has been lost or Broker failed to find routes to execute the quote'
    },
    failed: {
        info: 'Trades failed during the execution'
    },
    unconfirmed: {
        info: 'Client did not confirm swap transactions'
    },
    partial: {
        info: 'Quote has been executed partially'
    },
    success: {
        info: 'Quote has been fully executed'
    }
}

function decodeTradeStatus(tradeStatus) {
    switch (tradeStatus) {
        case 'success':
            return 'success'
        case 'failed':
            return 'failed'
        default:
            return 'unconfirmed'
    }
}

function AssetPair({pair}) {
    const sellingAsset = useAssetMeta(pair[0].asset)
    const buyingAsset = useAssetMeta(pair[1].asset)
    const [assetA, assetB] = pair.map(a => AssetDescriptor.parse(a.asset))

    if (!sellingAsset || !buyingAsset)
        return null

    return <span className="flex-inline asset-pair">
        <AssetIcon asset={pair[0].asset}/>
        <AssetIcon asset={pair[1].asset}/>&nbsp;
        <span>
            <span>{assetA.code} <i className="icon-swap text-small"/> {assetB.code}</span>
            {(sellingAsset.domain && buyingAsset.domain) && <span className="dimmed text-tiny block">
                {sellingAsset.domain} / {buyingAsset.domain}
            </span>}
       </span>
    </span>
}