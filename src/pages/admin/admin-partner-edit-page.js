import React from 'react'
import {useParams} from 'react-router-dom'
import PartnerEditForm from '../../components/partner-edit-form'

function AdminPartnerEditPage() {
    const {id} = useParams()
    const isEdit = !!id

    return <div>
        <div>
            <h4>{isEdit ? 'Edit' : 'Add'} partner</h4>
        </div>
        {isEdit ?
            <p className="text-small dimmed mini-space">ID {id}</p> :
            <p className="text-small dimmed mini-space">Manage new partner</p>}
        <div className="hr space"/>
        <PartnerEditForm id={id}/>
    </div>
}

export default AdminPartnerEditPage