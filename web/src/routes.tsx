import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './Header';
import Bye from './pages/Bye';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
type routesProps = {

};

const Routes: React.FC<routesProps> = () => {

    return <BrowserRouter>
        <Header/>
        <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/" component={Home} />
            <Route exact path="/bye" component={Bye} />

        </Switch>

    </BrowserRouter>

}
export default Routes;