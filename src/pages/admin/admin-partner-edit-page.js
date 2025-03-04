import React from 'react'
import {useParams} from 'react-router-dom'
import PartnerEditForm from '../../admin/partners/partner-edit-form'

export default function AdminPartnerEditPage() {
    const {id} = useParams()
    const isEdit = !!id

    return <div>
        <div>
            <h4>{isEdit ? 'Edit partner settings' : 'Add partner'}</h4>
        </div>
        <p className="text-small dimmed mini-space">
            {isEdit ?`Manage partner ${id}`:'Create new partner'}
        </p>
        <div className="hr space"/>
        <PartnerEditForm id={id}/>
    </div>
}