import Chart from '../../components/chart/chart'
import cn from 'classnames'

const defaultOptions = {
    chart: {
        //renderTo: (options.chart && options.chart.renderTo) || this,
        backgroundColor: null,
        borderWidth: 0,
        type: 'spline',
        margin: [10, 10, 10, 10],
        width: 100,
        height: 50,
        style: {
            overflow: 'visible'
        },
        // small optimization, saves 1-2 ms each sparkline
        skipClone: true
    },
    credits: {
        enabled: false
    },
    xAxis: {
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        crosshair: false,
        startOnTick: false,
        endOnTick: false,
        lineWidth: 0,
        tickPositions: []
    },
    yAxis: {
        endOnTick: false,
        startOnTick: false,
        gridLineColor: 'transparent',
        labels: {
            enabled: false
        },
        title: {
            text: null
        },
        tickPositions: []
    },
    tooltip: {
        outside: true,
        borderWidth: 1,
        hideDelay: 0,
        shared: true,
        padding: 4,
        formatter () {
            return `<span style="font-size: 10px;white-space: nowrap">${this.y}$ ${this.x}</span>`
        }
    },
    plotOptions: {
        series: {
            animation: false,
            lineWidth: 2,
            shadow: false,
            connectNulls: true,
            states: {
                hover: {
                    lineWidth: 2.4
                }
            },
            marker: {
                radius: 0,
                states: {
                    hover: {
                        radius: 2
                    }
                }
            },
            fillOpacity: 0.25
        }
    }
}

function StatisticsView() {

    return <div className="row">
        <div className="column column-25">
            <EntryStatisticView title="Daily volume" value="$42,960" growth="+68.15" data={[[24],[30],[47],[35],[16],[18],[53],[50],[86]]}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Monthly volume" value="$1,026,456" growth="+11.03" data={[[24],[30],[47],[35],[16],[18],[53],[50],[86]]}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Transactions today" value="2,516" growth="-4.5" data={[[3264],[3123],[4059],[3620],[1421],[1815],[5421],[7644],[7206]]}/>
        </div>
        <div className="column column-25">
            <EntryStatisticView title="Transactions this month" value="58,289" growth="+8.22" data={[[54670],[31230],[60509],[26200],[17210],[19150],[50214],[51644],[56244]]}/>
        </div>
    </div>
}

function EntryStatisticView({title, value, growth, data}) {
    const direction = parseFloat(growth) > 0 ? 'up' : 'down'
    const options = {
        series: [{
            data,
            name: '$',
            type: 'spline',
            showInLegend: false,
            dataLabels: {
                enabled: false
            }
        }],
        ...defaultOptions
    }
    options.tooltip.enabled = false

    return <div className="info-block micro-space">
        <p className="text-nano text-upper dimmed nano-space">{title}</p>
        <div className="dual-layout">
            <div>
                <h5 className="nano-space">{value}</h5>
                <div className={cn('badge', direction)}>{growth}%</div>
            </div>
            <Chart options={options}/>
        </div>
    </div>
}

export default StatisticsView