import {useEffect, useState} from 'react'
import Chart from '../../components/chart/chart'
import {performApiCall} from '../../api/api-call'
import {getAuth} from '../../api/auth'

export default function AssetChartView() {
    const userData = getAuth()
    const endPoint = userData?.roles.includes('admin') ? `asset-stats` : `partner/asset-stats`
    const [stats, setStats] = useState()
    useEffect(() => {
        performApiCall(endPoint)
            .then(result => {
                if (result.error) {
                    console.error(result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partner statistics.'})
                }
                setStats(result)
            })
    }, [])
    if (!stats)
        return null
    const limit = stats.length === 6 ? 6 : 5
    const data = stats.slice(0, limit).map(d => [d.asset.split('-')[0], d.swaps])
    if (stats.length > limit) {
        data.push(['Other ' + (stats.length - limit), stats.slice(limit).reduce((all, stat) => all + stat.swaps, 0)])
    }
    const title = 'Assets'
    const options = {
        chart: {
            type: 'pie'
        },
        yAxis: true,
        plotOptions: {
            pie: {
                shadow: false
            }
        },
        tooltip: {
            formatter: function () {
                return this.point.name
            }
        },
        series: [{
            data,
            size: '100%',
            innerSize: '80%',
            showInLegend: true,
            dataLabels: {
                enabled: false
            }
        }]
    }

    return <div className="info-block micro-space">
        <Chart {...{title, options}}/>
    </div>
}