import React, {useEffect, useState} from 'react'
import {performApiCall} from '../../api/api-call'
import {setPageMetadata} from '../../utils/meta-tags-generator'
import StatisticsView from '../../partner/dashboard/statistics-view'
import VolumeChartView from '../../partner/dashboard/volume-chart-view'
import AssetChartView from '../../partner/dashboard/asset-chart-view'
import SwapHistoryView from '../../partner/transactions/swap-history-view'

export default function AdminDashboardPage() {
    const [stats, setStats] = useState()

    useEffect(() => {
        performApiCall(`stats`)
            .then(result => {
                if (result.error) {
                    console.error(result.error)
                    return notify({type: 'error', message: 'Failed to retrieve statistics.'})
                }
                setStats(result)
            })
    }, [])

    setPageMetadata({
        title: 'Admin dashboard',
        description: 'Statistics of connected partners.'
    })

    if (!stats)
        return null

    return <div>
        <h3>Dashboard</h3>
        <p className="dimmed space">Statistics of connected partners</p>
        <div className="hr space"/>
        <StatisticsView isAdmin/>
        <div className="micro-space"/>
        <div className="row">
            <div className="column column-67">
                <VolumeChartView stats={stats}/>
            </div>
            <div className="column column-33">
                <AssetChartView/>
            </div>
        </div>
        <div className="micro-space"/>
        <SwapHistoryView compact endpoint="swaps"/>
    </div>
}