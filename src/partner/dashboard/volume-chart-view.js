import {memo} from 'react'
import Chart from '../../components/chart/chart'

export default memo(function VolumeChartView({stats}) {
    if (!stats)
        return null

    const title = 'Performance'
    const successSwaps = []
    const successTx = []
    const failedTx = []
    const fees = []
    for (const stat of stats) {
        const date = stat.ts * 1000
        const success = stat.stats.find(s => s.status === 'success')
        if (success) {
            successSwaps.push([date, success.swaps])
            successTx.push([date, success.tx])
            fees.push([date, success.fee || 0])
        }
        const failed = stat.stats.find(s => s.status === 'failed')
        if (failed) {
            failedTx.push([date, failed.tx])
        }
        //TODO: analyzed dropped tx stats
    }
    const options = {
        plotOptions: {
            column: {
                stacking: 'normal'
            },
            area: {
                opacity: 0.8
            }
        },
        yAxis: [
            {
                title: {
                    text: 'Processed transactions'
                }
            },
            {
                title: {
                    text: 'Earnings'
                },
                opposite: true
            }
        ],

        series: [
            {
                data: successTx,
                name: 'Successful transactions',
                type: 'column'
            },
            {
                data: failedTx,
                name: 'Failed transactions',
                type: 'column'
            },
            {
                data: fees,
                name: 'Charged fees',
                type: 'spline',
                yAxis: 1,
                tooltip: {
                    valueSuffix: '$'
                }
            }
        ]
    }

    return <div className="info-block micro-space">
        <Chart {...{title, options}}/>
    </div>
})