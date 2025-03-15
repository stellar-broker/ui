import cn from 'classnames'
import {getDailyValue, getMonthlyValue} from '../../utils/statistics-calculation'
import {splineOptions} from '../../components/chart/chart-default-options'
import Chart from '../../components/chart/chart'

export default function StatisticsView({stats}) {
    const dailyValueFee = getDailyValue(stats, 'fee')
    const dailyTx = getDailyValue(stats, 'tx')
    const monthlyValueFee = getMonthlyValue(stats, 'fee', 6) //display statistics for 3 months
    const monthlyTx = getMonthlyValue(stats, 'tx', 6) //display statistics for 3 months

    return <div className="row">
        <div className="column column-25">
            <EntryStatisticView title="Daily fees volume" value={`$${dailyValueFee.value}`} sign="$"
                                changes={dailyValueFee.changes} data={dailyValueFee.data}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Monthly fees volume" value={`$${monthlyValueFee.value}`} sign="$" onlyMonth
                                changes={monthlyValueFee.changes} data={monthlyValueFee.data}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Daily swaps" value={`${dailyTx.value}`}
                                changes={dailyTx.changes} data={dailyTx.data}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Monthly swaps" value={`$${monthlyTx.value}`} onlyMonth
                                changes={monthlyTx.changes} data={monthlyTx.data}/>
        </div>
    </div>
}

function EntryStatisticView({title, value, sign = '', changes, data = [], onlyMonth}) {
    const direction = changes ? parseFloat(changes) > 0 ? 'up' : 'down' : ''
    const options = {
        ...splineOptions,
        series: [{
            data,
            type: 'spline',
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }],
        tooltip: false
    }

    return <div className="info-block micro-space">
        <p className="text-nano text-upper dimmed nano-space">{title}</p>
        <div className="dual-layout">
            <div>
                <h5 className="nano-space">{value}</h5>
                <div className={cn('badge', direction)}>{changes}%</div>
            </div>
            <Chart options={options}/>
        </div>
    </div>
}