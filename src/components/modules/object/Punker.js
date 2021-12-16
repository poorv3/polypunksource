import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars';
import { BodyContext } from '~/context/BodyContext.js'
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";

export class Punker extends Component {
    render() {
        const Punks = this.props.punksData || [];
        const isSlidy = this.props.slidy
        const isLight = this.props.light
        const isFixitems = this.props.fixitems
        const appendStyle_punk = {
            backgroundColor: isLight ? '#f5f5f5' : '#ffffff',
            flexBasis: isFixitems ? '31%' : 'auto'
        }
        const appendStyle_container = {
            justifyContent: isFixitems ? 'flex-start' : 'flex-start',
            alignContent: 'flex-start',
        }
        SwiperCore.use([Navigation, Pagination, Scrollbar, Autoplay]);
        return (
            <>
                <div className={`Punkontainer`} style={{
                    flexDirection: this.props.slidy ? 'column' : 'row',
                    ...appendStyle_container
                }}>
                    {isSlidy
                        ?
                        <Swiper
                            freeMode
                            className="custome_swiper"
                        >
                            {Punks.map((Punk, i) => {
                                return (
                                    <SwiperSlide>
                                        <Link className={`Punkard ${this.props.punksActiveList ? (this.props.punksActiveList.includes(Punk.idx) ? '-active' : '') : ''}`} key={Punk.idx}
                                            to={this.props.connect ? `/marketplace/${Punk.idx}` : '/'}
                                            style={{
                                                ...appendStyle_punk
                                            }}
                                        >
                                            <div className="character">
                                                <div className="IC">
                                                    <img src={`https://polypunks.app/punks/pic/${Punk.idx}.png`} alt="" />
                                                </div>
                                            </div>
                                            <div className="info">
                                                <div className="basic">
                                                    <div className="name">
                                                        <span>
                                                            {Punk.idx}
                                                        </span>
                                                        <strong className="type">
                                                            {Punk.type}
                                                        </strong>
                                                    </div>
                                                    <div className="attrs">
                                                        {Punk.attributes.map((attr, ii) => {
                                                            return (
                                                                <div className={`attr`} key={ii}>
                                                                    <span>
                                                                        {attr}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="extra">
                                                    {Punk.extra &&
                                                        <>
                                                            <div className="price">
                                                                <span>
                                                                    {Punk.extra.punksOfferedForSale[0] && (window.web3Global && window.web3Global.utils.fromWei(Punk.extra.punksOfferedForSale.minValue))}
                                                                </span>
                                                            </div>
                                                            <div className="bid">
                                                                <span>
                                                                    {Punk.extra.punkBids[0] && (window.web3Global && window.web3Global.utils.fromWei(Punk.extra.punkBids.value)) || '-'}
                                                                </span>
                                                            </div>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                )
                            })}
                            <SwiperSlide>
                                <div className={`and_more`}>
                                    <div className="Actions">
                                        <Link className="Btn" to="/punks">
                                            <i className="ri-more-line"></i>
                                            <span>
                                                And more
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                        :
                        Punks.map((Punk, i) => {
                            return (
                                <Link className={`Punkard ${this.props.punksActiveList ? (this.props.punksActiveList.includes(i) ? '-active' : '') : ''}`} key={Punk.idx}
                                    to={this.props.connect ? `/marketplace/${Punk.idx}` : '/'}
                                    style={{
                                        imageRendering: 'pixelated',
                                        ...appendStyle_punk
                                    }}
                                >
                                    <div className="character">
                                        <div className="IC">
                                            <img src={`https://polypunks.app/punks/pic/${Punk.idx}.png`} alt="" />
                                        </div>
                                    </div>
                                    <div className="info">
                                        <div className="basic">
                                            <div className="name">
                                                <span>
                                                    {Punk.idx}
                                                </span>
                                                <strong className="type">
                                                    {Punk.type}
                                                </strong>
                                                {this.props.market &&
                                                    <strong className="price">
                                                        {/* {Punk.price} */}
                                                        210 MATICS
                                                    </strong>
                                                }
                                            </div>
                                            <div className="attrs">

                                                {Punk.attributes && Punk.attributes.map((attr, ii) => {
                                                    return (
                                                        <div className={`attr`} key={ii}>
                                                            <span>
                                                                {attr}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className="extra">
                                            {Punk.extra &&
                                                <>
                                                    <div className="price">
                                                        <span>
                                                            {Punk.extra.punksOfferedForSale[0] && (window.web3Global && window.web3Global.utils.fromWei(Punk.extra.punksOfferedForSale.minValue))}
                                                        </span>
                                                    </div>
                                                    <div className="bid">
                                                        <span>
                                                            {Punk.extra.punkBids[0] && (window.web3Global && window.web3Global.utils.fromWei(Punk.extra.punkBids.value)) || '-'}
                                                        </span>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div>
            </>
        )
    }
}