import React, {useEffect, useState} from 'react'
import StatisticsView from '../../partner/dashboard/statistics-view'
import VolumeChartView from '../../partner/dashboard/volume-chart-view'
import AssetChartView from '../../partner/dashboard/asset-chart-view'
import SwapHistoryView from '../../partner/transactions/swap-history-view'
import {performApiCall} from '../../api/api-call'
import {setPageMetadata} from '../../utils/meta-tags-generator'

export default function PartnerDashboardPage() {
    const [stats, setStats] = useState()

    useEffect(() => {
        performApiCall(`partner/stats`)
            .then(result => {
                if (result.error) {
                    console.error(result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partner statistics.'})
                }
                setStats(result)
            })
    }, [])

    setPageMetadata({
        title: 'Dashboard',
        description: 'Daily overview of partner integration status'
    })

    if (!stats)
        return null

    return <div>
        <h3>Dashboard</h3>
        <p className="dimmed space">Daily overview of your integration status</p>
        <div className="hr space"/>
        <StatisticsView/>
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
        <SwapHistoryView compact/>
        <div className="text-center micro-space text-tiny">
            <a href="/account/transactions">Explore all swaps</a>
        </div>
    </div>
}