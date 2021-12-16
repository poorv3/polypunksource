import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Scrollbars } from 'react-custom-scrollbars';
import { BodyContext } from '~/context/BodyContext.js'
import SwiperCore, { Navigation, Pagination, Scrollbar, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";

export class Loading extends Component {
    render() {
        return (
            <div className="LoadingBox">
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
}