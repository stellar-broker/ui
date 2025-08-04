import {useEffect, useState} from 'react'
import cn from 'classnames'
import {formatWithAutoPrecision} from '@stellar-expert/formatter'
import {performApiCall} from '../../api/api-call'

export default function StatisticsView({isAdmin}) {
    const [stats, setStats] = useState()
    useEffect(() => {
        performApiCall(!isAdmin ? 'partner/diff-stats' : 'diff-stats')
            .then(data => setStats(data))
    }, [])
    if (!stats)
        return <div style={{height: '6em'}}>
            <div className="loader"/>
        </div>

    return <div className="row">
        <div className="column column-25">
            <EntryStatisticView title="24H fees volume" value={formatWithAutoPrecision(stats.daily.fees)}
                                changes={formatWithAutoPrecision(stats.daily.feesChange)} prefix="$"/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Monthly fees volume" value={formatWithAutoPrecision(stats.monthly.fees)}
                                changes={formatWithAutoPrecision(stats.monthly.feesChange)} prefix="$"/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="24H swaps" value={formatWithAutoPrecision(stats.daily.swaps)}
                                changes={formatWithAutoPrecision(stats.daily.swapsChange)}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Monthly swaps" value={formatWithAutoPrecision(stats.monthly.swaps)}
                                changes={formatWithAutoPrecision(stats.monthly.swapsChange)}/>
        </div>
    </div>
}

function EntryStatisticView({title, value, prefix = '', changes = '0'}) {
    const direction = changes ? parseFloat(changes) >= 0 ? 'up' : 'down' : ''
    return <div className="info-block micro-space">
        <p className="text-nano text-upper dimmed nano-space">{title}</p>
        <h4 className="nano-space">
            {prefix}{value}
            {value !== '0' && <>
                {' '}
                <span className={cn('badge text-tiny', direction)} style={{verticalAlign: 'top'}}>
                    {parseFloat(changes) > 0 && '+'}
                    {changes}%
                </span>
            </>}
        </h4>
    </div>
}