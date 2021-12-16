import React, { Component } from 'react'
import $ from 'jquery'
import { BodyContext } from '~/context/BodyContext.js'
import Swal from 'sweetalert2'
import { Watch, Actions, WalletManager, Api } from '~/scripts'
import C from '~/components';

export default class MyPunks extends Component {
    static contextType = BodyContext;
    constructor() {
        super()
        this.state = {
            interf: {
                selectedWallet: 'METAMASK',
                wallet: {
                    isLoading: false,
                    name: null,
                },
                lengthOfShowingPunks: 50,
                filterings_types: [],
                filterings_attributes: [],
                selectedWalletAddress : '',
                tokenBalance : 0,
                withdrawable : 0
            },
            storage: {
                punks: null,
                punksToShow: null,
                isLoadedPunks: false
            },
            form: {

            },
        }
    }
    componentWillMount() {
        const [CT] = this.context;
        CT.set_classing({
            route: 'mypunks',
        });
    }

    componentDidMount() {
        Watch.init(this);
        Watch.punksScrollLoad(this, 1000);
        this._loadPunks()
    }
    _sst(main, obj) {
        this.setState({
            [main]: {
                ...this.state[main],
                ...obj
            }
        })
    }
    showFilterBox() {
        const [CT] = this.context;
        Swal.fire({
            title: '<div class="swal--head"> Filter </div>',
            icon: null,
            showCloseButton: true,
            html:
                `
                    <div class="swal--content">
                        <div class="filter_section">
                            ${Object.keys(CT.storage.FILTERS).map(filterGroup => {
                    return (`
                            <div class="title">
                                <span>
                                    ${filterGroup}
                                </span>
                            </div>
                            <div class="checklist">
                                ${Object.keys(CT.storage.FILTERS[filterGroup]).map(filter => {
                        return (`
                                <label class="CheckBox">${filter}
                                    <input type="checkbox" ${this.state.interf[`filterings_${filterGroup}`].includes(filter) ? 'checked' : ''} data-filter="${filterGroup}" data-value="${filter}" />
                                    <span class="checkmark"></span>
                                </label>
                        `)
                    }).join('')}
                            </div>
                    `)
                }).join('')}
                        </div>
                    </div>  
                `,
            focusConfirm: false,
            didOpen: () => {
                const _ = this;
                $('.swal .filter_section .checklist input').on('change', function () {
                    _.filterPunks(this.checked ? 'ADD' : 'DEL', $(this).attr('data-filter'), $(this).attr('data-value'))
                })
            },
            customClass: {
                container: 'swal',
                popup: 'swal-box -big',
                title: 'swal--title',
                closeButton: 'swal-closebtn',
                denyButton: '',
                confirmButton: 'Btn -force',
                cancelButton: '',
            }
        }).then((result) => {
            if (result.isConfirmed) {
            }
        })
    }
    searchPunks(value) {
        const punks = this.state.storage.punks
        const finded = []
        punks.find(x => x.idx == value) && finded.push(punks.find(x => x.idx == value))
        setTimeout(() => {
            this.setState({
                storage: {
                    ...this.state.storage,
                    punksToShow: value ? finded : punks
                }
            })
        }, 1000);
    }
    filterPunks(mode, section, filter) {
        let punks = mode === 'ADD' ? this.state.storage.punksToShow : this.state.storage.punks
        let filterings_types = this.state.interf.filterings_types
        let filterings_attributes = this.state.interf.filterings_attributes
        let localPunks = punks
        let filteredPunks = []
        if (section === 'attributes') {
            mode === 'ADD' ? filterings_attributes.push(filter) : filterings_attributes.pop(filter)
            filterings_attributes.map(filtering => {
                localPunks = localPunks.filter(punk => punk['attributes'].includes(filtering));
            })
            filteredPunks = localPunks
        }
        else if (section === 'types') {
            mode === 'ADD' ? filterings_types.push(filter) : filterings_types.pop(filter)
            localPunks = localPunks.filter(punk => punk['type'] === filterings_types[0]);
            filteredPunks = localPunks
        }
        this._sst('interf', { filterings_types })
        this._sst('interf', { filterings_attributes })
        this._sst('storage', { punksToShow: filteredPunks })
    }
    async filterSortByRanks(e) {
        let punks = this.state.storage.punks
        const [CT] = this.context;
        let rankedPunks = CT.storage.PUNKS_SORTED_BY_RANK
        let punksToShow = []
        const sortBy = CT.storage.RANKS

        await this._sst('interf', { filterings_attributes: [] })


        if (e.checked) {
            rankedPunks.map(punk => {
                punks.map(myPunk => {
                    punk.idx === myPunk.idx && punksToShow.push(punk)
                })
            })
            // await sortBy.map(async (sorter) => {
            //     punks.map(async (punk) => {
            //         punk.idx === parseInt(sorter) && punksToShow.push(punk)
            //     })
            // })
            // console.log(punksToShow)

            await this._sst('storage', { punksToShow: punksToShow })
        } else {
            await this._sst('storage', { punksToShow: punks })
        }

    }
    async _loadPunks() {
        setTimeout(async () => {

            let selectedWalletAddress = await WalletManager.getSelectedWallet();

            if(selectedWalletAddress !== "" && window.web3 && window.contract){
                let tokenBalance = await window.contract.methods.balanceOf(selectedWalletAddress).call();
                let withdrawable = await window.contract.methods.pendingWithdrawals(selectedWalletAddress).call();

                this._sst('interf', {
                    selectedWalletAddress,
                    tokenBalance,
                    withdrawable
                })

            }



            let _punks = []
            let currentPunkIndex = null
            const [CT] = this.context;
            const selectedWallet = await WalletManager.getSelectedWallet();
            if (WalletManager.walletStatus) {
                const myPunks = await Api.get(`/my?wallet=${selectedWallet}`)
                await CT.storage.PUNKS.map(punk => {
                    myPunks.map(myPunk => {
                        myPunk.token_id == punk.idx && _punks.push({
                            ...punk,
                            extra: {
                                punkBids: myPunk.punkBids ?? {},
                                punksOfferedForSale: myPunk.punksOfferedForSale ?? {},
                            }
                        })
                    })
                })

                this._sst('storage', {
                    punks: _punks,
                    punksToShow: _punks,
                    isLoadedPunks: true
                })
            } else {
                this._sst('storage', { isLoadedPunks: true, punks : [], punksToShow : [] })
            }

        }, 1500);

    }
    async extractToWallet(){

        try{

            await window.contract.methods.withdraw().send({
                from : this.state.interf.selectedWalletAddress
            });

        }catch (e) {
            console.log(e);
        }

    }

    render() {
        const [CT] = this.context
        const interf = this.state.interf
        const Punks = this.state.storage.punksToShow
        const isLoadedPunks = this.state.storage.isLoadedPunks
        return (
            <>
                <div className="explorer">
                    {isLoadedPunks
                        ?
                        Punks
                            ?
                            <>
                                {interf.selectedWalletAddress != "" &&
                                    <div className="my_balance">
                                        <div className="counter">
                                            <div className="description">
                                                <p>

                                                </p>
                                            </div>
                                            <div className="punks">
                                                <p>
                                                    You have <strong className="cash">{interf.tokenBalance}</strong> Punks
                                                </p>
                                            </div>
                                            <div className="currency">
                                                <p>
                                                    Pending Withdraw <strong className="cash">{window.web3Global.utils.fromWei(interf.withdrawable)}</strong> MATIC
                                                </p>
                                            </div>
                                        </div>
                                        <div className="actions">
                                            <div className="Actions">
                                                <a className="Btn" onClick={() => this.extractToWallet()}>
                                                    <i className="ri-wallet-line"></i>
                                                    <span>
                                                        Withdraw
                                                    </span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className="filtering">
                                    <div className="searcher">
                                        <div className="InputBox -full">
                                            <input type="text" placeholder="Search by punk number..."
                                                onChange={(e) => this.searchPunks(e.target.value)}
                                            />
                                            <i className="ri-search-2-line"></i>
                                        </div>
                                    </div>
                                    <div className="extra">
                                        <div className="fast_filter">
                                            {/* <label className="CheckBox">Only have Bid
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                </label> */}
                                            <label onClick={(e) => this.filterSortByRanks(e.target)} className="CheckBox">Sort by Rank
                                                <input type="checkbox" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </div>
                                        <div className="Actions">
                                            <a className="Btn -simple" onClick={() => this.showFilterBox()}>
                                                <i className="ri-equalizer-line"></i>
                                                <span>
                                                    Filter
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="my_punks">
                                    <C.Punker fixitems light connect punksData={Punks.slice(0, this.state.interf.lengthOfShowingPunks)} containerOptions={{ wrap: true }} />
                                </div>
                            </>
                            :
                            !Punks.length && 'There is no any Punk'
                        :
                        <C.Loading />
                    }
                </div>
            </>
        )
    }
}