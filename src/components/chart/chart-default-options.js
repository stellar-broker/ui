import Highcharts from 'highcharts'

//allow negative values on the logarithmic axis
Highcharts.Axis.prototype.allowNegativeLog = true

//override conversions
Highcharts.Axis.prototype.log2lin = function (num) {
    let adjustedNum = Math.abs(num)
    if (adjustedNum < 10) {
        adjustedNum += (10 - adjustedNum) / 10
    }
    const result = Math.log(adjustedNum) / Math.LN10
    return num < 0 ? -result : result
}
Highcharts.Axis.prototype.lin2log = function (num) {
    let result = Math.pow(10, Math.abs(num))
    if (result < 10) {
        result = (10 * (result - 1)) / (10 - 1)
    }
    return num < 0 ? -result : result
}

const defaultTextStyle = {
    fontSize: '12px',
    fontFamily: 'Inter,sans-serif',
    fontWeight: 400,
    color: '#151C25'
}

const theme = Highcharts.theme = {
    colors: ['hsl(219, 100%, 50%)', 'hsl(31, 100%, 56%)', 'hsl(112, 67%, 61%)', 'hsl(324, 79%, 60%)',
        'hsl(214, 100%, 60%)', 'hsl(174, 62%, 46%)', 'hsl(115,40%,46%)', 'hsl(270,40%,66%)',
        'hsl(155,60%,46%)', 'hsl(0,40%,66%)', 'hsl(100,43%,66%)', 'hsl(250,50%,66%)',
        'hsl(143,40%,66%)', 'hsl(340,40%,46%)', 'hsl(212,40%,46%)', 'hsl(235,40%,46%)',
        'hsl(135,60%,40%)', 'hsl(320,50%,66%)'
    ],
    title: {
        text: '',
        style: {...defaultTextStyle, fontSize: '17px'}
    },
    chart: {
        backgroundColor: null,
        spacing: [10, 10, 10, 10],
        style: {
            fontFamily: 'sans-serif'
        }
    },
    scrollbar: {
        enabled: false
    },
    tooltip: {
        shared: true,
        split: false,
        borderWidth: 0,
        headerFormat: '<span>{point.key}</span>',
        shadow: false
    },
    legend: {
        itemStyle: defaultTextStyle
    },
    navigator: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    navigation: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    xAxis: {
        type: 'datetime',
        crosshair: true,
        ordinal: false,
        minPadding: 0,
        maxPadding: 0,
        gridLineWidth: 1,
        lineColor: 'var(--color-border-shadow)',
        gridLineColor: 'var(--color-border-shadow)',
        minorGridLineColor: 'var(--color-border-shadow)',
        minorTickColor: 'var(--color-border-shadow)',
        tickColor: 'var(--color-border-shadow)',
        title: {
            style: defaultTextStyle,
            margin: 4
        },
        labels: {
            style: defaultTextStyle
        }
    },
    yAxis: {
        minorTickInterval: 'auto',
        lineColor: 'var(--color-border-shadow)',
        gridLineColor: 'var(--color-border-shadow)',
        minorGridLineColor: 'var(--color-border-shadow)',
        minorTickColor: 'var(--color-border-shadow)',
        tickColor: 'var(--color-border-shadow)',
        title: {
            style: defaultTextStyle
        },
        labels: {
            style: defaultTextStyle
        }
    },
    plotOptions: {
        series: {
            pointPadding: 0.1
        }
    },
    time: {
        useUTC: true
    },
    //general
    background2: '#fff',
    lang: {
        decimalPoint: '.',
        thousandsSep: ','
    }
}



const splineOptions = {
    chart: {
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
        borderWidth: 0,
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

//apply the theme
Highcharts.setOptions(theme)

export {Highcharts, splineOptions}
