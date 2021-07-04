import React from 'react';
import { useByeQuery } from '../generated/graphql';

type ByeProps = {

};

const Bye: React.FC<ByeProps> = () => {
    const { data, error, loading } = useByeQuery({
        fetchPolicy: 'network-only'
    });

    if (error) {
        console.log(error)
        return <div>Error!</div>
    }
    if (loading) {
        return <div>loading!</div>
    }
    if (!data) {
        return <div>No data</div>
    }

    return <div>{data?.bye}</div>

}
export default Bye;