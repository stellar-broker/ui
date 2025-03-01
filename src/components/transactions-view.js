import {useEffect, useState} from 'react'
import {swaps} from '../utils/swaps-demo'
import {formatDate, formatStroopPrice} from '../utils/formatter'
import {useAssetInfo} from '../utils/hooks/asset-info-hook'
import {AssetIcon} from './ui/asset-link'
import formatDateTime from '../utils/date-formater'

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
        //TODO: get swaps from API
        setTransactions(swaps?.map(tx => parseTx(tx)))
    }, [swaps])

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
    const sellingAsset = useAssetInfo(pair[0].asset)
    const buyingAsset = useAssetInfo(pair[1].asset)

    if (!sellingAsset || !buyingAsset)
        return null

    return <span className="flex-inline">
       <AssetIcon asset={pair[0].asset}/>
       <AssetIcon asset={pair[1].asset}/>&nbsp;
    <span>
            <span>{sellingAsset.code} <i className="icon-switch text-tiny"/> {buyingAsset.code}</span>
    {(sellingAsset.domain && buyingAsset.domain) && <span className="dimmed text-tiny block">
                {sellingAsset.domain} / {buyingAsset.domain}
            </span>}
       </span>
    </span>
}

function SearchView() {
    return <div className="flex-middle">
        <i className="icon-search"/>
        <input placeholder="Search"/>
    </div>
}

export default TransactionsView