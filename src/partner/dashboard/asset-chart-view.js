import Chart from '../../components/chart/chart'

function AssetChartView() {

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
            formatter: function() {
                return this.point.name
            }
        },
        series: [{
            data: [[`USDC 68%`,68],['XLM',22],["AQUA",8],["Other",3]],
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