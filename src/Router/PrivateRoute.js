import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { Auth } from '~/scripts/'

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={
                (props) => {
                    if (Auth.isAuth()) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={
                            {
                                pathname: '/login',
                                state: {
                                    from: props.location
                                }
                            }
                        } />
                    }
                }
            } />

    )
}
