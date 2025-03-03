import {useEffect} from 'react'
import {performApiCall} from '../api/api-call'
import {stringifyQuery} from '../utils/query'
import {Button} from './ui/button'

function PartnersView({partnerList}) {
    return <div>
        {partnerList?.map((partner) => {
            return <div key={partner.id} className="micro-space">
                <div className="card outline">
                    <div className="row">
                        <div className="nano-space column column-50">
                            <b>{partner.email}</b>
                        </div>
                        <div className="nano-space column column-50 desktop-right">
                            <PartnerFees settings={partner.settings}/>
                        </div>
                    </div>
                    <div className="micro-space"/>
                    <PartnerStatView id={partner.id}/>
                    <div className="micro-space"/>
                    <div className="desktop-right">
                        <Button outline onClick={logInAs} data-id={partner.id}>Log in as</Button>
                        <Button href={`edit/${partner.id}`} style={{marginBottom: 0}}>
                            <i className="icon-cog"/> Change settings</Button>
                    </div>
                </div>
            </div>
        })}
    </div>
}

function logInAs(e) {
    const partnerId = e.target.dataset.id
    performApiCall('login-in-as', {method: 'POST', params: {id: partnerId}})
        .then(res => {
            if (res.error)
                return notify({type: 'warning', message: res.error})
            location.href = '/account'
        })
}

function PartnerFees({settings}) {
    if (!settings)
        return null
    return <span>
        {Object.entries(settings).map(([key, value]) => {
            if (!value)
                return null
            return <span key={key}>
            <span className="dimmed"> {key}: </span>{value / 100}%
        </span>
        }).filter(v => !!v)}
    </span>
}

function PartnerStatView({id}) {
    useEffect(() => {
        const params = {
            limit: 1,
            order: 'desc'
        }
        performApiCall(`partner/${id}/swaps${stringifyQuery(params)}`)
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partner statistics. ' + result.error})
            })
    }, [id])

    return <div className="row text-small">
        <div className="column column-50">
            <span className="dimmed">Daily volume:</span> $1,220
        </div>
        <div className="column column-50">
            <span className="dimmed">Monthly volume:</span> $81,220
        </div>
        <div className="column column-50">
            <span className="dimmed">Transactions today:</span> 1,015
        </div>
        <div className="column column-50">
            <span className="dimmed">Transactions this month:</span> 11,060
        </div>
        <div className="column column-50">
            <span className="dimmed">Total transactions:</span> 321,770
        </div>
    </div>
}

export default PartnersView