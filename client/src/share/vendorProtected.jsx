import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const VendorProtected = ({ compo }) => {
    const auth = useSelector(state => state.auth) || {}; // safe fallback
    const { shopId } = auth;
    const navigate = useNavigate()

    useEffect(() => {
        if (!shopId) {
            navigate('/login')
        }
    }, [shopId, navigate])

    return shopId ? <>{compo}</> : null
}

export default VendorProtected
// Dataincript