import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';


const Login: React.FC<RouteComponentProps> = ({ history }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [login] = useLoginMutation();
    return <div>
        <form onSubmit={async e => {
            e.preventDefault()
            console.log('form submitted')
            console.log(email, password)
            const response = await login({
                variables: {
                    email, password
                },
                update: (store, { data }) => {
                    if (!data) {
                        return null;
                    }

                    store.writeQuery<MeQuery>({
                        query: MeDocument,
                        data: {
                            me: data.login.user
                        }
                    })
                }
            })
            if (response && response.data) {
                setAccessToken(response.data.login.accessToken);
            }

            history.push('/')
        }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
    </div>
}
export default Login;