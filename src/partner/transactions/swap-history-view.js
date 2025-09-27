import React, {useCallback, useState} from 'react'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {fromStroops, formatDateUTC} from '@stellar-expert/formatter'
import {usePaginatedApi} from '../../utils/hooks/paginated-list-hooks'
import {navigation} from '../../utils/navigation'
import {useAssetMeta} from '../../utils/hooks/asset-meta-hook'
import {AssetIcon, Loader, Button, AccountAddress, Amount, Dropdown} from '../../components/ui'

import './swap-history.scss'
import PartnerLink from '../../components/partner-link'

const statusFilterOptions = [
    {title: 'All', value: ''},
    {title: 'Success', value: 'success'},
    {title: 'Cancelled', value: 'cancelled'}
]

function parseAsset(asset) {
    const [code, issuer] = asset.split('-')
    return {
        asset,
        code,
        issuer
    }
}

export default function SwapHistoryView({compact, endpoint = 'partner/swaps'}) {
    const [statusFilter, setStatusFilter] = useState(navigation.query.status || '')
    const transactions = usePaginatedApi(
        {
            path: endpoint,
            query: {
                status: statusFilter || undefined,
                cursor: navigation.query.cursor,
                search: navigation.query.search
            }
        }, {
            autoReverseRecordsOrder: true,
            limit: compact ? 10 : 20,
            defaultQueryParams: {order: 'desc'}
        }, [statusFilter])

    const changeStatusFilter = useCallback(status => setStatusFilter(status), [compact, endpoint])

    if (!transactions.loaded)
        return <Loader/>
    const isPartnerHistory = endpoint.startsWith('partner')
    return <div>
        <div className="table space swaps-history">
            {!!compact && <div className="table-header">
                <h5 className="bold">Swap history</h5>
            </div>}
            <table>
                <thead className="text-tiny dimmed-light">
                <tr>
                    <th>Pair</th>
                    <th>Account</th>
                    <th>Sell</th>
                    <th>Fees</th>
                    <th className="desktop-center">
                        <Dropdown options={statusFilterOptions} onChange={changeStatusFilter} value={statusFilter}
                                  title={statusFilter ? statusFilter : 'Status'}/>
                    </th>
                    <th className="desktop-right">Date</th>
                    <th className="collapsing text-right">&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                {transactions.data?.map(swap => <SwapRecord swap={swap} showPartner={!isPartnerHistory}
                                                            key={swap.paging_token}/>)}
                </tbody>
            </table>
            {!transactions.data.length && <p className="empty-data dimmed">(no transactions)</p>}
        </div>
        {!compact && <div className="button-group space text-center">
            <HistoryNavButton transactions={transactions} direction={-1}>Prev Page</HistoryNavButton>
            <HistoryNavButton transactions={transactions} direction={1}>Next Page</HistoryNavButton>
        </div>}
    </div>
}

function HistoryNavButton({transactions, direction, children}) {
    const navigate = useCallback(e => {
        e.preventDefault()
        e.stopPropagation()
        const direction = parseInt(e.target.dataset.direction)
        transactions.load(direction)
        return false
    }, [transactions])
    const disabled = transactions.loading ||
        !(direction === 1 ? transactions.canLoadNextPage : transactions.canLoadPrevPage)
    return <Button small secondary disabled={disabled} data-direction={direction} onClick={navigate}>
        {children}
    </Button>
}

function SwapRecord({swap, showPartner = false}) {
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
            <td data-header="Account: ">
                {!!swap.account && <AccountAddress address={swap.account} className="text-small font-mono"/>}
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
                <span title={swapStatusInfo[status.toLowerCase()].info} className="dimmed-light">{status}</span>
            </td>
            <td className="desktop-right" data-header="Date: ">
                <div className="dimmed-light">{formatDateUTC(date)}</div>
                {showPartner && <div className="text-tiny dimmed-light condensed">
                    <PartnerLink id={swap.partner} apikey={swap.apikey}/>
                </div>}
            </td>
            <td>
                <a href="#" className={`dimmed-light text-nano ${expanded ? 'icon-chevron-up' : 'icon-chevron-down'}`}
                   title="Show details" onClick={toggleExpanded}>
                    <span className="mobile-only"> Show details</span>
                </a>
            </td>
        </tr>
        {expanded && <tr className="details text-small">
            <td colSpan="7" style={{paddingLeft: '4em'}}>
                <div className="row">
                    <div className="column column-25">
                        <span className="dimmed-light">Quote estimated amount:</span><br/>
                        {swap.quote.estimatedBuyingAmount ?
                            <Amount amount={swap.quote.estimatedBuyingAmount} asset={swap.buyingAsset} adjust
                                    issuer={false}/> :
                            'N/A'}
                        <div className="micro-space"/>
                    </div>
                    <div className="column column-25">
                        <span className="dimmed-light">Slippage tolerance:</span><br/>
                        {swap.quote.slippageTolerance * 100}%
                        <div className="micro-space"/>
                    </div>
                </div>
                <div className="micro-space"/>
                {swap.trades.map(trade => <SwapTx key={trade.id} trade={trade} swap={swap}/>)}
            </td>
        </tr>}
    </>
}

function SwapTx({trade, swap}) {
    return <div className="micro-space">
        <Amount amount={trade.sold || trade.estimatedSold} asset={swap.sellingAsset} adjust issuer={false}/>
        &emsp;<i className="icon-arrow-right text-tiny dimmed-light"/>&emsp;
        <Amount amount={trade.bought || trade.estimatedBought} asset={swap.buyingAsset} adjust issuer={false}/>
        &emsp;
        {!!trade.fee && <span className="dimmed-light nowrap">Fee: ${fromStroops(trade.fee)}</span>}
        &emsp;
        <span className="dimmed-light">{decodeTradeStatus(trade.status)}</span>
        &emsp;
        <span className="dimmed-light nowrap">{formatDateUTC(trade.created)}</span>
        &emsp;
        {(trade.status === 'success' || trade.status === 'failed') &&
            <a href={`https://stellar.expert/explorer/public/tx/${trade.tx}`} target="_blank"
               title="View transaction details" className="icon-link dimmed-light"/>}
        {!!trade.venues && <div className="dimmed-light text-tiny">{trade.venues.split('→').map((step, i) => {
            let [venue, asset] = step.split(':')
            let renderAs
            if (!asset) {
                asset = venue
            } else if (venue.indexOf('-') > 0) {
                const [protocol, contract] = venue.split('-')
                renderAs = <>{protocol}:<AccountAddress address={contract} icon={false}/></>
            } else {
                renderAs = venue
            }
            return <span key={i}>{i > 0 && ' → '}{renderAs} {asset.split('-')[0]}</span>
        })}</div>}
    </div>
}

function getSwapStatus(swap) {
    if (!swap.trades.length)
        return 'Dropped'
    const totalSold = swap.trades.filter(trade => trade.status === 'success').reduce((acc, trade) => acc + BigInt(trade.sold), 0n)
    if (totalSold > 0n) {
        if (totalSold < BigInt(swap.sellingAmount))
            return 'Partial'
        return 'Success'
    }
    if (swap.trades.some(trade => trade.status === 'failed'))
        return 'Failed'
    return 'Unconfirmed'
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
            return 'Success'
        case 'failed':
            return 'Failed'
        default:
            return 'Unconfirmed'
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
            <span>{assetA.code} <i className="icon-arrow-right text-small"/> {assetB.code}</span>
            {(sellingAsset.domain && buyingAsset.domain) && <span className="dimmed block domains">
                {sellingAsset.domain} / {buyingAsset.domain}
            </span>}
       </span>
    </span>
}