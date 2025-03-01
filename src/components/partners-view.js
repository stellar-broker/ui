import {useEffect} from 'react'
import {performApiCall} from '../api/api-call'
import {stringifyQuery} from '../utils/query'
import {Button} from './ui/button'
import formatDateTime from '../utils/date-formater'

function PartnersView({partnerList}) {
    return <div className="row">
        {partnerList?.map((partner) => {
            const partnerVarFee = partner.settings?.partnerVarFee ? partner.settings.partnerVarFee / 100 + '%' : '-'
            const brokerVarFee = partner.settings?.brokerVarFee ? partner.settings.brokerVarFee / 100 + '%' : '-'
            return <div key={partner.id} className="column column-25 micro-space">
                <div className="card outline space">
                    <div className="nano-space">
                        <b>Email: </b><span>{partner.email}</span>
                    </div>
                    <div className="nano-space">
                        <b>Partner fee: </b><span>{partnerVarFee}</span>
                    </div>
                    <div className="nano-space">
                        <b>Broker fee: </b><span>{brokerVarFee}</span>
                    </div>
                    <div className="micro-space">
                        <b>Created: </b><span>{partner.created ? formatDateTime(partner.created, true) : '-'}</span>
                    </div>
                    <div className="hr micro-space"/>
                    <PartnerStatView id={partner.id}/>
                    <div className="hr micro-space"/>
                    <div className="text-right text-small">
                        <Button href={`edit/${partner.id}`} className="text-small" style={{marginBottom: 0}}>
                            <i className="icon-cog"/> Change settings</Button>
                    </div>
                </div>
            </div>
        })}
    </div>
}

function PartnerStatView({id}) {
    useEffect(() => {
        const params = {
            limit: 1,
            order: 'desc'
        }
        performApiCall(`partner/${id}/swaps${stringifyQuery(params)}`, {auth: true})
            .then((result) => {
                if (result.error)
                    return notify({type: 'error', message: 'Failed to retrieve partner statistics. ' + result.error})
            })
    }, [id])

    return <div className="micro-space">
        <div className="nano-space text-small">
            <span>Daily volume:</span> <span className="dimmed">$1,220</span>
        </div>
        <div className="nano-space text-small">
            <span>Monthly volume:</span> <span className="dimmed">$81,220</span>
        </div>
        <div className="nano-space text-small">
            <span>Transactions today:</span> <span className="dimmed">1,015</span>
        </div>
        <div className="nano-space text-small">
            <span>Transactions this month:</span> <span className="dimmed">11,060</span>
        </div>
        <div className="text-small">
            <span>Total transactions:</span> <span className="dimmed">321,770</span>
        </div>
    </div>
}

export default PartnersView