import React from 'react'
import StatisticsView from '../../partner/dashboard/statistics-view'
import VolumeChartView from '../../partner/dashboard/volume-chart-view'
import AssetChartView from '../../partner/dashboard/asset-chart-view'
import TransactionsView from '../../partner/transactions/transactions-view'

function PartnerDashboardPage() {

    return <div>
        <h4>Dashboard</h4>
        <p className="text-small dimmed mini-space">Daily overview of your integration status</p>
        <div className="hr space"/>
        <StatisticsView/>
        <div className="micro-space"/>
        <div className="row">
            <div className="column column-67">
                <VolumeChartView/>
            </div>
            <div className="column column-33">
                <AssetChartView/>
            </div>
        </div>
        <div className="micro-space"/>
        <TransactionsView compact/>
    </div>
}

export default PartnerDashboardPage