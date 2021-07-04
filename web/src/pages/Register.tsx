import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';


const Register: React.FC<RouteComponentProps> = ({ history }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [register] = useRegisterMutation();
    return <div>
        <form onSubmit={async e => {
            e.preventDefault()
            console.log('form submitted')
            console.log(email, password)
            const response = await register({
                variables: {
                    email, password
                }
            })
            history.push('/')
            console.log(response)
        }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit">Register</button>
        </form>
    </div>
}
export default Register;