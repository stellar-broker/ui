import {Link} from 'react-router-dom'
import dateFormat from '../utils/date-formater'
import {Button} from './ui/button'

function PartnersView({partnerList}) {
    return <div className="row">
        {partnerList?.map((partner) => {
            return <div key={partner.id} className="column column-33 micro-space">
                <div className="card outline space">
                    <div className="nano-space">
                        <b>Email: </b><span>{partner.email}</span>
                    </div>
                    <div className="nano-space">
                        <b>Dynamic fee: </b><span>{partner.settings.partnerVarFee / 100}%</span>
                    </div>
                    <div className="nano-space">
                        <b>Fixed fee: </b><span>{partner.settings.striderVarFee / 100}%</span>
                    </div>
                    <div className="micro-space">
                        <b>Created: </b><span>{dateFormat(partner.created, true)}</span>
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