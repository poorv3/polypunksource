import React, { useContext, useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { BodyContext } from '~/context/BodyContext.js'
import { useWindowDimensions } from '~/hooks'

export const Navbar = props => {
    const [setting] = useContext(BodyContext);
    const [activeBurgerMenu, set_activeBurgerMenu] = useState(false)
    const base_path = '';
    const location = useLocation()
    const baseRoute = location.pathname.slice(1).indexOf('/') != -1 ? ('/' + location.pathname.substr(1, location.pathname.slice(1).indexOf('/'))) : location.pathname
    const { height: windowHeight, width: windowWidth } = useWindowDimensions();
    const toggleBurgerMenu = (mode) => {
        set_activeBurgerMenu(mode ? mode : !activeBurgerMenu)
    }
    const r_menuLinks = () => {
        return (
            <>
                <div className="ACTION">
                    <Link
                        onClick={() => toggleBurgerMenu(false)}
                        to={`${base_path}/`}
                        className={`link -icony ${baseRoute === '/' && "-active"}`}>
                        <i className="ri-home-2-line"></i>
                        <span className="text">Home</span>
                    </Link>
                </div>
                {/*<div className="ACTION">*/}
                {/*    <Link*/}
                {/*        onClick={() => toggleBurgerMenu(false)}*/}
                {/*        to={`${base_path}/punks`}*/}
                {/*        className={`link -icony ${baseRoute === '/punks' && "-active"}`}>*/}
                {/*        <i className="ri-apps-2-line"></i>*/}
                {/*        <span className="text">All PolyPunks</span>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                {/* <div className="ACTION">
                    <Link
                        onClick={() => toggleBurgerMenu(false)}
                        to={`${base_path}/mint`}
                        className={`link -icony ${baseRoute === '/mint' && "-active"}`}>
                        <i className="ri-bank-card-2-line"></i>
                        <span className="text">Mint</span>
                    </Link>
                </div> */}
                {/*<div className="ACTION">*/}
                {/*    <Link*/}
                {/*        onClick={() => toggleBurgerMenu(false)}*/}
                {/*        to={`${base_path}/forsale`}*/}
                {/*        className={`link -icony ${baseRoute === '/forsale' && "-active"}`}>*/}
                {/*        <i className="ri-shopping-cart-line"></i>*/}
                {/*        <span className="text">For Sale</span>*/}
                {/*    </Link>*/}
                {/*</div>*/}
                <div className="ACTION">
                    <Link
                        onClick={() => toggleBurgerMenu(false)}
                        to={`${base_path}/marketplace`}
                        className={`link -icony ${baseRoute === '/marketplace' && "-active"}`}>
                        <i className="ri-shopping-cart-line"></i>
                        <span className="text">Marketplace</span>
                    </Link>
                </div>
                <div className="ACTION -important">
                    <Link
                        onClick={() => toggleBurgerMenu(false)}
                        to={`${base_path}/mypunks`}
                        className={`link -icony ${baseRoute === '/mypunks' && "-active"}`}>
                        <i className="ri-user-line"></i>
                        <span className="text">My PolyPunks</span>
                    </Link>
                </div>
            </>
        )
    }
    return (
        <div className="NAVBAR">
            <div className="c-">
                <div className="ACTION">
                    <Link
                        to={`${base_path}/`}
                        className={`brand`}>
                        <img src={require('~/assets/images/brand/Logo-Full.png').default} />
                    </Link>
                </div>
                <div className="BURGER">
                    <a
                        style={{
                            borderColor: activeBurgerMenu ? '#000' : 'transparent'
                        }}
                        onClick={() => toggleBurgerMenu()}
                        className={`link -icony`}>
                        <i className="ri-menu-3-line"></i>
                    </a>
                </div>
                <div className="links _onDesktop">
                    {r_menuLinks()}
                </div>
                <div className="links _onPhone"
                    style={{
                        display: activeBurgerMenu ? (windowWidth <= '700' ? 'flex' : 'none') : 'none'
                    }}
                >
                    {r_menuLinks()}
                </div>
            </div>
        </div>
    )
}
