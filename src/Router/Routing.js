import React, { useContext } from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { BodyContext } from '~/context/BodyContext.js'
import { PrivateRoute } from './PrivateRoute'
import C from '~/components'
// 
import Home from '~/pages/guest/Home'
import Punks from '~/pages/guest/Punks';
import Mint from '../pages/guest/Mint';
import Market from '../pages/guest/Market';
import MyPunks from '../pages/guest/MyPunks';
import PunkPage from '../pages/guest/Market/PunkPage';
import MainMarket from "../pages/guest/MainMarket";
// 

const R_User = props => {
    const [setting] = useContext(BodyContext);
    const base_path = props.match.path;
    return (
        <div className={"route " + setting.classing.route}>
            <div className="page">
                <div className="c-">
                    <C.Navbar />
                    {/* <Titlebar /> */}
                    <C.Content>
                        User
                    </C.Content>
                </div>
            </div>
        </div>
    );
}
const R_Guest = props => {
    const [setting] = useContext(BodyContext);
    const base_path = props.match.path === '/' ? '' : props.match.path;
    return (
        <div className={"route " + setting.classing.route}>
            <div className="page">
                <div className="c-">
                    <C.Navbar />
                    {/* <Titlebar /> */}
                    <C.Content>
                        <Switch>
                            <Route exact path={`${base_path}/`} component={Home} />
                            <Route path={`${base_path}/punks`} render={() => <>
                                <Route exact path={`${base_path}/punks`} component={Punks} />
                                <Route path={`${base_path}/punks/:id`} component={PunkPage} /></>
                            } />
                            <Route path={`${base_path}/mint`} component={Mint} />
                            <Route path={`${base_path}/forsale`} render={() => <>
                                <Route exact path={`${base_path}/forsale`} component={Market} />
                                <Route path={`${base_path}/forsale/:id`} component={PunkPage} /></>
                            } />

                            <Route path={`${base_path}/marketplace`} render={() => <>
                                <Route exact path={`${base_path}/marketplace`} component={MainMarket} />
                                <Route path={`${base_path}/marketplace/:id`} component={PunkPage} /></>
                            } />

                            <Route path={`${base_path}/mypunks`} component={MyPunks} />
                            <Redirect path={`*`} to={`/`} />
                            {setting.authRedirection}
                        </Switch>
                    </C.Content>
                </div>
            </div>
        </div>
    );
}
const R_Admin = props => {
    const [setting] = useContext(BodyContext);
    return (
        <div className={"route " + setting.route}>
            <div className="page">
                <div className="c-">
                    <C.Content>
                        Admin
                    </C.Content>
                </div>
            </div>
        </div>
    );
}

const Routing = {}
Routing.user = R_User;
Routing.guest = R_Guest;
Routing.admin = R_Admin;
export default Routing;