import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { setAccessToken } from './accessToken';
import Routes from './routes';
import './app.css'
type AppProps = {

};

const App: React.FC<AppProps> = () => {

    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        fetch('http://localhost:4000/refresh_token', {
            credentials: 'include',
            method: 'POST'
        }).then(async (x)=>{
            const {accessToken} = await x.json();
            setAccessToken(accessToken);
            setLoading(false);
        })
    },[])

    if(loading){
        return <div>Loading....</div>
    }

    return <Routes />
}
export default App;