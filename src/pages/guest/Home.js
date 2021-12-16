import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { BodyContext } from '~/context/BodyContext.js'
import { Watch, Actions, Web3Global } from '~/scripts'
import C from '~/components';

export default class Home extends Component {
    static contextType = BodyContext;
    constructor() {
        super()
        this.state = {
            interf: {
                activePunkCTA: [],
                placeHeroImage: null,
                activeHotViewTab: 'MALE',
                remainingPunks: {
                    all: 10000,
                    free: 98220
                }
            },
            PunkLeft: '',
            PunkLeftTimer: null,
            storage: {
                punks: null,
                punksToShow: null
            }
        }
    }
    componentWillMount() {
        const [CT] = this.context;
        CT.set_classing({
            route: 'home',
        });

        this.checkPunkLeft();

        setTimeout(async () => {
            await this.checkPunkLeft();
        }, 10000);

    }
    componentDidMount() {
        Watch.init(this);
        this.activePunkCtaAutoChange();
        // 
        const [CT] = this.context;
        this._loadPunks(null, CT.storage.PUNKS)
        this.setHotViewActiveTab(this.state.interf.activeHotViewTab)
        //
        // AutoChange on Hero Image
        setInterval(() => {
            this.setState({
                interf: {
                    ...this.state.interf,
                    placeHeroImage: this.state.interf.placeHeroImage == require('~/assets/images/brand/Logo-Shape-modified.png').default ? require('~/assets/images/brand/Logo-Shape.png').default : require('~/assets/images/brand/Logo-Shape-modified.png').default
                }
            })
        }, 2000);
    }
    _loadPunks(punksToShow, punks) {
        this.setState({
            storage: {
                ...this.state.storage,
                punks: punks || this.state.storage.punks,
                punksToShow: punksToShow || this.state.storage.punksToShow
            }
        })
    }
    activePunkCtaAutoChange() {
        const [CT] = this.context;
        let indicators = [];
        const Punks = CT.storage.PUNKS.slice(0, 50)
        setInterval(() => {
            indicators = [Math.floor(Math.random() * Punks.length) + 1, Math.floor(Math.random() * Punks.length) + 1, Math.floor(Math.random() * Punks.length) + 1];
            this.setState({
                interf: {
                    ...this.state.interf,
                    activePunkCTA: indicators
                }
            })
        }, 2000);
    }
    setHotViewActiveTab(tab) {
        const [CT] = this.context
        const punks = CT.storage.PUNKS
        let finded = []
        const tabCorrectType = tab.toLowerCase()[0].toUpperCase() + tab.toLowerCase().slice(1);
        finded = punks.filter(item => item.type.indexOf(tabCorrectType) !== -1) ? punks.filter(item => item.type.indexOf(tabCorrectType) !== -1) : this.state.storage.punksToShow
        this.setState({
            interf: {
                ...this.state.interf,
                activeHotViewTab: tab
            }
        })
        this._loadPunks(finded)
    }
    async checkPunkLeft() {
        try {
            let remain = await window.contractGlobal.methods.mintsRemaining().call();
            this.setState({
                PunkLeft: remain
            })
        } catch (e) {
            console.log(e);
        }
    }
    render() {
        const [CT] = this.context;
        const interf = this.state.interf
        const Punks = this.state.storage.punks
        const hotViewPunks = this.state.storage.punksToShow
        return (
            <>
                <div className="section -full" style={{ marginBottom: 0 }}>
                    <div className="hero">
                        <div className="ABS cta_punks">
                            {true && <C.Punker connect punksData={CT.storage.PUNKS.slice(0, 50)} punksActiveList={interf.activePunkCTA} />}
                        </div>
                        <div className="body">
                            <div className="brand">
                                <div className="shape">
                                    <img src={this.state.interf.placeHeroImage} />
                                </div>
                                <div className="type">
                                    <img src={require('~/assets/images/brand/Logo-Type.png').default} />
                                </div>
                            </div>
                            <div className="remains">
                                <span>
                                    polypunks
                                </span>
                                <div className="body">

                                    <div className="free">
                                        <span>
                                            {this.state.PunkLeft.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="seprator">
                                        <span>
                                            /
                                        </span>
                                    </div>
                                    <div className="all">
                                        <span>
                                            {interf.remainingPunks.all.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <span>
                                    remaining
                                </span>
                            </div>
                            {/*<div className="minter">*/}
                            {/*    <div className="description">*/}
                            {/*        <p>*/}
                            {/*            Mint a PolyPunk before all are gone 😉*/}
                            {/*        </p>*/}
                            {/*    </div>*/}
                            {/*    <div className="act">*/}
                            {/*        <div className="Actions">*/}
                            {/*            <Link className="Btn" to="/mint">*/}
                            {/*                <i className="ri-bank-card-2-line"></i>*/}
                            {/*                <span>*/}
                            {/*                    Mint*/}
                            {/*                </span>*/}
                            {/*            </Link>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="punks_hotview">
                        <div className="head">
                            <div className="tabs">
                                <div className={`tab ${interf.activeHotViewTab === 'MALE' ? '-active' : ''}`} onClick={() => this.setHotViewActiveTab('MALE')}>
                                    <span>
                                        Male
                                    </span>
                                </div>
                                <div className={`tab ${interf.activeHotViewTab === 'FEMALE' ? '-active' : ''}`} onClick={() => this.setHotViewActiveTab('FEMALE')}>
                                    <span>
                                        Female
                                    </span>
                                </div>
                                <div className={`tab ${interf.activeHotViewTab === 'ZOMBIE' ? '-active' : ''}`} onClick={() => this.setHotViewActiveTab('ZOMBIE')}>
                                    <span>
                                        Zombie
                                    </span>
                                </div>
                                <div className={`tab ${interf.activeHotViewTab === 'APE' ? '-active' : ''}`} onClick={() => this.setHotViewActiveTab('APE')}>
                                    <span>
                                        Ape
                                    </span>
                                </div>
                                <div className={`tab ${interf.activeHotViewTab === 'ALIEN' ? '-active' : ''}`} onClick={() => this.setHotViewActiveTab('ALIEN')}>
                                    <span>
                                        Alien
                                    </span>
                                </div>
                            </div>
                            <div className="more">
                                <div className="Actions">
                                    <Link className="Btn" to="/punks">
                                        <i className="ri-apps-line"></i>
                                        <span>
                                            Explore all Punks
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="body">
                            {hotViewPunks && <C.Punker connect slidy punksData={hotViewPunks.slice(0, 11)} containerOptions={{ wrap: true }} punksActiveList={interf.activePunkCTA} />}
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="whywe">
                        <div className="question">
                            <span>
                                Why PolyPunks?
                            </span>
                        </div>
                        <div className="answers">
                            <div className="answer -full_col -item1">
                                <div className="titlebox">
                                    <div className="icon">
                                        <span>
                                            🔀
                                        </span>
                                    </div>
                                    <div className="title">
                                        <span>
                                            Random Punks
                                        </span>
                                    </div>
                                </div>
                                <div className="body">
                                    <p>
                                        In the interest of fairness and to give everyone the chance to own one (or more) PolyPunks, the purchase is made on a random basis.
                                        We are not affiliated with the larvalabs.
                                    </p>
                                </div>
                            </div>
                            <div className="answer -full_row -item2">
                                <div className="titlebox">
                                    <div className="icon">
                                        <span>
                                            💜
                                        </span>
                                    </div>
                                    <div className="title">
                                        <span>
                                            To be Rare
                                        </span>
                                    </div>
                                </div>
                                <div className="body">
                                    <p>
                                        The identity of the PolyPunks will remain a mystery until your purchase is completed. No first come, first serve, everyone has an equal chance to get the the rare punks such as ape, zombie or aliens.
                                    </p>
                                </div>
                            </div>
                            <div className="answer -full_row -item3">
                                <div className="titlebox">
                                    <div className="icon">
                                        <span>
                                            🛒
                                        </span>
                                    </div>
                                    <div className="title">
                                        <span>
                                            Marketplace
                                        </span>
                                    </div>
                                </div>
                                <div className="body">
                                    <p>
                                        Our Marketplace page will be ready once all PolyPunks are minted. You can get as many PolyPunks as you want but once the 10,000 are sold it will be too late to get one at mint cost.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="cta_mint">
                        <div className="background bg-gradient-hot">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                                <path fill="transparent" fillOpacity="1" d="M0,32L48,37.3C96,43,192,53,288,90.7C384,128,480,192,576,181.3C672,171,768,85,864,80C960,75,1056,149,1152,181.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                            </svg>
                        </div>
                        <div className="text">
                            <p>
                                After the success of Bunks and Solpunks.
                                Cryptopunks are now on polygon! Don't miss the chance to own them
                            </p>
                        </div>
                        {/*<div className="act">*/}
                        {/*    <div className="Actions">*/}
                        {/*        <Link className="Btn" to="/mint">*/}
                        {/*            <i className="ri-bank-card-2-line"></i>*/}
                        {/*            <span>*/}
                        {/*                Mint some PolyPunks*/}
                        {/*            </span>*/}
                        {/*        </Link>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <C.Footer />
            </>
        )
    }
}