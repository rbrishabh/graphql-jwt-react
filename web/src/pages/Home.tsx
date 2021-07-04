import React from 'react';
import { useUsersQuery } from '../generated/graphql';

type HomeProps = {

};

const Home: React.FC<HomeProps> = () => {

    const { data } = useUsersQuery({ fetchPolicy: 'network-only' })

    return (<div>
        {!data && 'Loading....'}
        <ul>
            {data && (
                data.users.map(u => (
                    <li key={u.id}> {u.email}, {u.id}</li>
                ))
            )}
        </ul>
    </div>)
}
export default Home;