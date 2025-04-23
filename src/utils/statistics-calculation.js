import {normalizePrice} from './normalize-price'

function getStatValues(stats, period) {
    const periodStats = stats.slice(0, period)
    const valueA = periodStats[0][1]
    const valueB = periodStats[1][1]
    const changedValue = valueB > valueA ? -100 : 0

    return {
        value: normalizePrice(valueA),
        changes: valueA ? normalizePrice((valueA - valueB) / valueA * 100) : changedValue,
        data: periodStats.reverse()
    }
}

const getDailyValue = (stats, type, period = 14) => {
    //get day limit
    const now = new Date()
    const oneDay = 24 * 60 * 60 * 1000
    now.setUTCHours(0,0,0,0)
    //prepare the daily thresholds
    const periods = []
    let startPeriod = now.getTime()
    for (let i = 1; i <= period; i++) {
        periods.push([startPeriod, startPeriod + oneDay])
        startPeriod -= oneDay
    }
    //calculate statistics for each day
    let dailyStats = []
    periods.forEach(day => {
        let totalValue = 0
        stats.forEach(entry => {
            const date = entry.ts * 1000
            if (date >= day[0] && date < day[1]) {
                totalValue += entry.stats.reduce((total, val) => {
                    return total + (val[type] || 0)
                }, 0)
            }
        })
        dailyStats.push([day[0], parseFloat(totalValue.toFixed(7))])
    })

    return getStatValues(dailyStats, period)
}

const getMonthlyValue = (stats, type, period = 12) => {
    //get month limit
    const now = new Date()
    now.setUTCHours(0,0,0,0)
    now.setUTCDate(1)
    now.setUTCMonth(now.getUTCMonth() + 1)
    //prepare the monthly thresholds
    const periods = []
    const periodDate = new Date(now.getTime())
    for (let i = 1; i <= period; i++) {
        const end = periodDate.getTime()
        periodDate.setUTCMonth(now.getUTCMonth() - i)
        const start = periodDate.getTime()
        periods.push([start, end])
    }
    //calculate statistics for each month
    let monthlyStats = []
    periods.forEach(month => {
        let totalValue = 0
        stats.forEach(entry => {
            const date = entry.ts * 1000
            if (date >= month[0] && date < month[1]) {
                totalValue += entry.stats.reduce((total, val) => {
                    return total + (val[type] || 0)
                }, 0)
            }
        })
        monthlyStats.push([month[0], parseFloat(totalValue.toFixed(7))])
    })

    return getStatValues(monthlyStats, period)
}

export {getDailyValue, getMonthlyValue}