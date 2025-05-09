import React, {useCallback, useEffect, useState} from 'react'
import {formatDateUTC, shortenString} from '@stellar-expert/formatter'
import {navigation} from '../../utils/navigation'
import {usePaginatedApi} from '../../utils/hooks/paginated-list-hooks'
import {Loader, Dropdown, Button, AccountAddress, Amount} from '../../components/ui'
import {formatExplorerLink} from '../../components/ui/explorer-link'

const statusFilterOptions = [
    {title: 'All', value: ''},
    {title: 'Pending', value: 'pending'},
    {title: 'Success', value: 'success'},
    {title: 'Failed', value: 'failed'}
]

export default function WithdrawHistoryView() {
    const [statusFilter, setStatusFilter] = useState(navigation.query.status || '')
    const payouts = usePaginatedApi(
        {
            path: 'partner/withdrawals',
            query: {
                status: statusFilter || undefined,
                cursor: navigation.query.cursor,
                search: navigation.query.search
            }
        }, {
            autoReverseRecordsOrder: true,
            limit: 10,
            defaultQueryParams: {order: 'desc'}
        }, [statusFilter])

    useEffect(() => {
        const handle = setInterval(() => payouts.load(0), 5000)
        return () => clearInterval(handle)
    }, [])

    const navigate = useCallback(page => payouts.load(page), [])

    return <div>
        <div className="table space">
            <div className="table-header">
                <h5 className="bold">Payouts history</h5>
            </div>
            <table>
                <thead className="text-tiny dimmed-light">
                <tr>
                    <th className="collapsing" style={{width: '20%'}}>Transaction</th>
                    <th className="collapsing" style={{width: '20%'}}>Address</th>
                    <th className="desktop-right" style={{width: '20%'}}>Amount</th>
                    <th className="desktop-center" style={{width: '10%'}}>
                        <Dropdown options={statusFilterOptions} onChange={setStatusFilter} value={statusFilter}
                                  title={statusFilter ? statusFilter : 'Status'}/>
                    </th>
                    <th className="desktop-right collapsing" style={{width: '15%'}}>Date</th>
                </tr>
                </thead>
                <tbody>
                {!payouts.loaded && !payouts.data && <Loader/>}
                {payouts.data?.map(payout => <WithdrawRecord payout={payout} key={payout.paging_token}/>)}
                </tbody>
            </table>
            {payouts.loaded && !payouts.data.length && <p className="empty-data dimmed text-tiny">(no withdrawals)</p>}
        </div>
        <div className="button-group space text-center">
            <Button small secondary disabled={payouts.loading || !payouts.canLoadPrevPage} onClick={() => navigate(-1)}>Prev
                Page</Button>
            <Button small secondary disabled={payouts.loading || !payouts.canLoadNextPage} onClick={() => navigate(1)}>Next
                Page</Button>
        </div>
    </div>
}

function WithdrawRecord({payout}) {
    return <tr>
        <td data-header="Transaction: ">
            <a href={formatExplorerLink('tx', payout.tx)} target="_blank">{shortenString(payout.tx, 12)}</a>
        </td>
        <td data-header="Address: ">
            <AccountAddress address={payout.destination} chars={12} className="text-small font-mono"/>
        </td>
        <td data-header="Amount: " className="desktop-right">
            <span className="font-mono">
                <Amount amount={payout.amount} asset="USDC-GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" issuer={false}/>
            </span>
        </td>
        <td className="desktop-center" data-header="Status: ">
            {payout.status}
        </td>
        <td className="desktop-right nowrap" data-header="Date: "><span className="dimmed-light">{formatDateUTC(payout.created)}</span></td>
    </tr>
}