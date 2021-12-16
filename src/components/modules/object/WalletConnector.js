import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { BodyContext } from '~/context/BodyContext.js'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'


export const WalletConnector = () => {
    const { activate, account } = useWeb3React()
    async function connect() {
        try {
            const injected = new InjectedConnector()
            await activate(injected)
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div>
            <>
                <div className="Actions">
                    <a className="Btn" onClick={() => connect()}>
                        <i className="ri-link-m"></i>
                        <span>
                            Connect to Wallet {account}
                        </span>
                    </a>
                </div>
            </>
        </div>
    )
}