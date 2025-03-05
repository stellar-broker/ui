import {useEffect, useState} from 'react'
import Chart from '../../components/chart/chart'
import {performApiCall} from '../../api/api-call'

function AssetChartView() {
    const [stats, setStats] = useState()
    useEffect(() => {
        performApiCall(`partner/asset-stats`)
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
    const limit = 5
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

export default AssetChartView