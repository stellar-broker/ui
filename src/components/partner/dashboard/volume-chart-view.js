import Chart from '../../chart/chart'

function VolumeChartView() {

    const title = 'Monthly volume'
    const options = {
        yAxis: {
            title: false
        },
        series: [{
            data: [
                [new Date('2024-08-10T18:16:45.700Z').getTime(),36],
                [new Date('2024-09-12T18:16:45.700Z').getTime(), 68],
                [new Date('2024-10-13T18:16:45.700Z').getTime(),42],
                [new Date('2024-11-14T18:16:45.700Z').getTime(),80],
                [new Date('2024-12-15T18:16:45.700Z').getTime(),66]
            ],
            name: 'Value',
            type: 'spline',
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }]
    }

    return <div className="info-block micro-space">
        <Chart {...{title, options}}/>
    </div>
}

export default VolumeChartView