import {useEffect, useState} from 'react'
import {AssetDescriptor} from '@stellar-expert/asset-descriptor'
import {formatDate, formatStroopPrice} from '../../utils/formatter'
import formatDateTime from '../../utils/date-formater'
import {performApiCall} from '../../api/api-call'
import {stringifyQuery} from '../../utils/query'
import {useAssetMeta} from '../../utils/hooks/asset-meta-hook'
import {AssetIcon} from '../../components/ui/asset-link'
import SearchView from '../../components/ui/search-view'

function parseAsset(asset) {
    const [code, issuer] = asset.split('-')
    return {
        asset,
        code,
        issuer
    }
}

function parseTx(tx) {
    return {
        ledger: tx.quote.ledger,
        pair: [parseAsset(tx.sellingAsset), parseAsset(tx.buyingAsset)],
        sell: formatStroopPrice(tx.sellingAmount),
        get: formatStroopPrice(tx.quote.estimatedBuyingAmount),
        date: formatDate(tx.created)
    }
}

function TransactionsView({compact}) {
    const [transactions, setTransactions] = useState()

    useEffect(() => {
        const params = {
            limit: compact ? 10 : 20,
            order: 'desc'
        }
        performApiCall(`partner/swaps${stringifyQuery(params)}`)
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partner statistics. ' + result.error})
                setTransactions(result?._embedded.records.map(tx => parseTx(tx)))
            })
    }, [])

    return <div className="table space">
        <div className="table-header">
            {compact ? <h5>Transactions</h5> : <SearchView/>}
        </div>
        <table>
            <thead className="text-tiny dimmed">
                <tr>
                    <th>Pair</th>
                    <th>Sell</th>
                    <th>Get</th>
                    <th>Date</th>
                    <th className="collapsing text-right">&nbsp;</th>
                </tr>
            </thead>
            <tbody className="condensed">
                {transactions?.map(({pair, sell, get, date, ledger}) => {
                    return <tr key={date + pair[0].code + pair[1].code}>
                        <td className="text-small" data-header="Pair: ">
                            <AssetPairView pair={pair}/>
                        </td>
                        <td className="text-small" data-header="Sell: ">
                            {sell} {pair[0].code}
                        </td>
                        <td className="text-small" data-header="Get: ">
                            {get} {pair[1].code}
                        </td>
                        <td className="text-small" data-header="Date: ">{formatDateTime(date)}</td>
                        <td><a href={`https://stellar.expert/explorer/public/ledger/` + ledger} target="_blank">
                            <i className="icon-open-new-window"/></a></td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}

function AssetPairView({pair}) {
    const sellingAsset = useAssetMeta(pair[0].asset)
    const buyingAsset = useAssetMeta(pair[1].asset)
    const [assetA, assetB] = pair.map(a => AssetDescriptor.parse(a.asset))

    if (!sellingAsset || !buyingAsset)
        return null

    return <span className="flex-inline">
       <AssetIcon asset={pair[0].asset}/>
       <AssetIcon asset={pair[1].asset}/>&nbsp;
    <span>
            <span>{assetA.code} <i className="icon-switch text-tiny"/> {assetB.code}</span>
    {(sellingAsset.domain && buyingAsset.domain) && <span className="dimmed text-tiny block">
                {sellingAsset.domain} / {buyingAsset.domain}
            </span>}
       </span>
    </span>
}

export default TransactionsView