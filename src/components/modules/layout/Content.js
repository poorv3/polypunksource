import React, { useContext, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars';
import { BodyContext } from '~/context/BodyContext.js'

export const Content = props => {
    const [setting] = useContext(BodyContext);
    const [activeContent, set_activeContent] = useState(false)
    return (
        <div className={`CONTENT ${props.full ? '-full' : ''}`} onMouseEnter={() => set_activeContent(true)} onMouseLeave={() => set_activeContent(false)}>
            <Scrollbars
                renderThumbVertical={() =>
                    <div className="SCROLLBAR -vertical" style={{
                        opacity: activeContent ? 1 : 0
                    }} />
                }
                renderThumbHorizontal={({ style }) =>
                    <div style={{
                        display: 'none'
                    }} />
                }
                renderView={({ style, ...props }) => {
                    return (
                        <div className='SCROLLVIEW' {...props} style={{
                            ...style,
                            marginRight: 0,
                            marginBottom: 0
                        }} />
                    );
                }}
            >
                <div className="BODY">
                    {props.children}
                </div>
            </Scrollbars>
        </div>
    )
}