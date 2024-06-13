import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {ColorRing} from "react-loader-spinner"
export default function Protected({ children, authentication = true }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const authStatus = useSelector(state => state.auth.status);
    useEffect(() => {
        if (authentication && authStatus !== authentication) navigate("/login");
        else if (!authentication && authStatus !== authentication) navigate("/");
        setLoading(false);
    },
        [authentication, authStatus, navigate]
    )
    return loading ?( <div className='flex justify-center items-center w-full h-screen'> <ColorRing height="100" width="100" /></div>) : <>{children}</>
}

