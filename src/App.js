import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './styles/App.scss';
import 'remixicon/fonts/remixicon.css'
import 'simplebar/dist/simplebar.min.css'
import { BodyProvider } from './context/BodyContext.js'
import Routing from './Router/Routing'

function App() {

    if (process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
        return (
            <div className="APP">
                <Router>
                    <BodyProvider>
                        <Switch>
                            {/* Routes */}
                            <Route path="/" component={Routing.guest} />
                            <Route path="/dashboard" component={Routing.user} />
                            <Route path="/admin" component={Routing.admin} />
                            <Redirect path='*' to="/" />
                        </Switch>
                    </BodyProvider>
                </Router>
            </div>
        );
    } else {
        if (window.location.protocol == 'http:') {
            window.location.href = "https://polypunks.app";
            return;
        }

        if((window.location.href.indexOf('unks.ap') > -1))
            return (
                <div className="APP">
                    <Router>
                        <BodyProvider>
                            <Switch>
                                {/* Routes */}
                                <Route path="/" component={Routing.guest} />
                                <Route path="/dashboard" component={Routing.user} />
                                <Route path="/admin" component={Routing.admin} />
                                <Redirect path='*' to="/" />
                            </Switch>
                        </BodyProvider>
                    </Router>
                </div>
            );
        else
            return (
                <div className="APP">

                </div>
            );
    }



}

export default App;
