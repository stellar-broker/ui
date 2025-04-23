import React, {useCallback, useEffect, useRef} from 'react'
import cn from 'classnames'
import {Highcharts} from './chart-default-options'
import {ChartLoader} from './chart-loader'
import './chart.scss'

export {Highcharts, ChartLoader}

/**
 * Standard charting component
 * @param {{}} options - Data and options
 * @param {'Chart'|'StockChart'} [type] - Chart type
 * @param {String|JSX.Element} [title] - Chart title
 * @param {Boolean} [inline] - Whether to render the chart as inline-block (for sparkline charts)
 * @param {Boolean} [grouped] - Whether to apply data grouping
 * @param {true|false|'year'|'month'} [range] - Date range
 * @param {Boolean} [noLegend] - Hide the legend section
 * @param {String} [container] - Container class
 * @param {String} [className] - Additional CSS classes
 * @param {{}} [style] - Additional CSS styles
 * @param {Function[]} [modules] - Additional modules
 * @param {*} [children] - Optional children components that will be added to the header
 * @constructor
 */
export default function Chart({
                                  options,
                                  type = 'Chart',
                                  title,
                                  inline,
                                  grouped,
                                  range,
                                  noLegend,
                                  container = '',
                                  className,
                                  style,
                                  modules,
                                  children
                              }) {
    const chart = useRef(null)
    const chartIdRef = useRef(`chart${Math.random() * 0x10000000000000}`)
    const destroyChart = useCallback(function () {
        if (chart.current) {
            chart.current.destroy()
            chart.current = null
        }
    }, [chartIdRef.current])

    useEffect(() => {
        destroyChart()
        if (!options) return

        chart.current = new Highcharts[type](chartIdRef.current, options)

        return destroyChart
    }, [options, modules, type, inline, title])


    if (!options) {
        return <ChartLoader title={title}/>
    }
    const containerStyle = {...style}
    if (inline) {
        containerStyle.display = 'inline-block'
        return <div id={chartIdRef.current} style={containerStyle}/>
    }
    return <div className={cn('chart', container, className)} style={containerStyle}>
        {!!title && <h5 className="micro-space bold">{title}</h5>}
        {children}
        <div id={chartIdRef.current}/>
    </div>
}

Chart.Loader = ChartLoader