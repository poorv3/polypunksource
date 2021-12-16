import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { BodyContext } from '~/context/BodyContext.js'

export const Titlebar = props => {
    const [setting] = useContext(BodyContext);
    return (
        <div className="TITLEBAR">
            {/* <div className="c-">
                <div className="ACTION">
                    <Link className="link -icony">
                        <div className="c-">
                            <i className="ri-arrow-left-s-line"></i>
                        </div>
                    </Link>
                </div>
                <div className="title">
                    <h2>
                        Titlebar
                    </h2>
                </div>
                <div className="ACTION">
                    <Link className="link -icony">
                        <div className="c-">
                            <i className="ri-apps-2-line"></i>
                        </div>
                    </Link>
                </div>
            </div> */}
        </div>
    )
}