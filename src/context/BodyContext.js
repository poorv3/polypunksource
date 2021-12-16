import React, { useState, createContext } from 'react'
import { Redirect } from 'react-router-dom';
import { punks as punksData, punksSortedByRank as punksSortedByRankData, filters as filtersData, ranks as ranksData } from '~/data'
import Swal from 'sweetalert2'

export const BodyContext = createContext();
export const BodyProvider = props => {
    const [classing, set_classing] = useState({});
    const [authRedirection, set_authRedirection] = useState();
    let CT = {
        classing: classing,
        set_classing: set_classing,
        authRedirection: authRedirection,
        set_authRedirection: function (mode) {
            mode === 'LOGOUT' && set_authRedirection(<Redirect to='/login' />)
            mode === 'LOGIN' && set_authRedirection(<Redirect to='/dashboard' />)
        },
        storage: {
            PUNKS: punksData,
            PUNKS_SORTED_BY_RANK: punksSortedByRankData,
            FILTERS: filtersData,
            RANKS: ranksData,
        },
        statics: {
            docs: {
                white_paper: require('~/assets/docs/white-paper.pdf').default
            },
            contract: {
                address: '0x320f537da591da33Dd1A04dCB062434e3D176D3E'
            }
        },
        swal: (mode, data) => {
            return new Promise((resolve, reject) => {
                let initialData = {
                    title: `<div class="swal--head">${data.title || 'title'}</div>`,
                    icon: mode ? mode.toLowerCase() : null
                }
                Swal.fire({
                    ...initialData,
                    showCloseButton: true,
                    focusConfirm: false,
                    focusCancel: false,
                    html:
                        `
                            <div class="swal--content">
                                ${data.body || ''}
                            </div>
                        `,
                    customClass: {
                        container: 'swal',
                        popup: 'swal-box',
                        title: 'swal--title',
                        closeButton: 'swal-closebtn',
                        denyButton: '',
                        confirmButton: 'Btn -force',
                        cancelButton: '',
                    },
                    ...data.modify || null
                })
                    .then(res => {
                        if (res.isConfirmed) {
                            resolve(true)
                        } else if (res.isDenied) {
                            reject(false)
                        }
                    })
                    .catch(err => {
                        reject(err)
                    })
            })
        },
        utils: {
            walletAddress: (address) => {
                return address.length > 10 ? address.substr(0, 6) + '...' + address.substr(address.length - 4, address.length) : address
            }
        }
    }
    return (
        <BodyContext.Provider value={[CT]}>
            {props.children}
        </BodyContext.Provider>
    )
}