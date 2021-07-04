import React from 'react';
import { Link } from 'react-router-dom';
import { setAccessToken } from './accessToken';
import { useLogoutMutation, useMeQuery } from './generated/graphql';

type HeaderProps = {

};

const Header: React.FC<HeaderProps> = () => {
    const [logout, { client }] = useLogoutMutation()
    const { data, loading } = useMeQuery()

    if (loading) {
        return <div> Loading....</div>
    }
    return (
        <div>
            <header>
                <div>
                    <div><Link to="/">Home</Link></div>
                    <div><Link to="/register">Register</Link></div>
                    <div><Link to="/login">Login</Link></div>
                    <div><Link to="/bye">Bye</Link></div>
                    <div>

                        {!loading && data && data.me ? (
                            <button onClick={async () => {
                                await logout();
                                setAccessToken('')
                                await client.resetStore()
                            }}>Logout</button>
                        ) : null}
                    </div>
                </div>

                {data && data.me ? data.me.email : (<div>Not Logged In</div>)}
            </header>
        </div>
    )
}
export default Header;