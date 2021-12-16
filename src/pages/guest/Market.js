import React, { Component } from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom';
import { BodyContext } from '~/context/BodyContext.js'
import { Watch, Actions, Api } from '~/scripts'
import C from '~/components';
import Swal from 'sweetalert2';

export default class Market extends Component {
    static contextType = BodyContext;
    constructor() {
        super()
        this.state = {
            interf: {
                lengthOfShowingPunks: 50,
                filterings_types: [],
                filterings_attributes: [],
                filterings_sort: [],
                isLoading: false,
                isSortByRank: false,
                isOnlyHasBid: false,
            },
            storage: {
                punks: [],
                punksToShow: []
            }
        }
    }
    componentWillMount() {
        const [CT] = this.context;
        CT.set_classing({
            route: 'market',
        });
    }
    componentDidMount() {
        Watch.init(this);
        this._loadData();
    }
    async _loadData() {
        const [CT] = this.context;
        this._sst('interf', { isLoading: true })
        const forSalePunks = await Api.get('/forSale')
        let currentPunkIndex = null
        let punks = []
        await CT.storage.PUNKS.map(async punk => {
            forSalePunks.map(forSalePunk => {
                currentPunkIndex = forSalePunk.punkBids.punkIndex != 0 ? forSalePunk.punkBids.punkIndex : forSalePunk.punksOfferedForSale.punkIndex
                currentPunkIndex == punk.idx && punks.push({
                    ...punk,
                    extra: {
                        punkBids: forSalePunk.punkBids,
                        punksOfferedForSale: forSalePunk.punksOfferedForSale,
                    }
                })
            })
        })
        this._sst('storage', { punks: punks, punksToShow: punks })
        this._sst('interf', { isLoading: false })
        Watch.punksScrollLoad(this);
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
        let as = CT.storage.FILTERS.attributes
        console.log(as)
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
                                <label class="CheckBox">${filter} ${CT.storage.FILTERS[filterGroup][filter].count ? '(' + CT.storage.FILTERS[filterGroup][filter].count + ")" : ''}
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
        let { filterings_types, filterings_attributes, filterings_sort } = this.state.interf
        let localPunks = punks
        let filteredPunks = []
        if (section === 'attributes') {
            mode === 'ADD' ? filterings_attributes.push(filter) : filterings_attributes.pop(filter)
            filterings_attributes.map(filtering => {
                localPunks = localPunks.filter(punk => punk['attributes'].includes(filtering));
            })
            filteredPunks = localPunks
        } else if (section === 'types') {
            mode === 'ADD' ? filterings_types.push(filter) : filterings_types.pop(filter)
            localPunks = localPunks.filter(punk => punk['type'] === filterings_types[0]);
            filteredPunks = localPunks
        } else if (section === 'sort') {
            filterings_sort = []
            mode === 'ADD' ? filterings_sort.push(filter) : filterings_sort.pop(filter)
            // localPunks = localPunks.filter(punk => punk['type'] === filterings_sort[0]);
            filteredPunks = localPunks
        }
        this._sst('interf', { filterings_types })
        this._sst('interf', { filterings_attributes })
        this._sst('interf', { filterings_sort })
        this._sst('storage', { punksToShow: filteredPunks })
    }
    async filterSortByRanks(e) {
        this._sst('interf', { isLoading: true })
        let punks = this.state.interf.isOnlyHasBid ? this.state.storage.punksToShow : this.state.storage.punks
        const [CT] = this.context;
        let rankedPunks = CT.storage.PUNKS_SORTED_BY_RANK
        let punksToShow = []

        await this._sst('interf', { filterings_attributes: [] })

        if (e.checked) {
            rankedPunks.map(punk => {
                punks.map(myPunk => {
                    punk.idx === myPunk.idx && punksToShow.push(myPunk)
                })
            })
            await this._sst('storage', { punksToShow: punksToShow })
            this._sst('interf', { isLoading: false })
            this._sst('interf', { isSortByRank: true })
        } else {
            await this._sst('storage', { punksToShow: punks })
            this._sst('interf', { isLoading: false })
            this._sst('interf', { isSortByRank: false })
        }
    }
    async filterOnlyHasBid(e) {
        this._sst('interf', { isLoading: true })
        const [CT] = this.context;
        const punks = this.state.interf.isSortByRank ? this.state.storage.punksToShow : this.state.storage.punks
        let punksToShow = []

        await this._sst('interf', { filterings_attributes: [] })

        if (e.checked) {
            await punks.map(async punk => {
                if (punk.extra.punkBids[0]) {
                    punksToShow.push(punk)
                }
            })
            await this._sst('storage', { modify_punksToShow: punksToShow })
            this._sst('interf', { isLoading: false })
            this._sst('interf', { isOnlyHasBid: true })
        } else {
            this.filterSortByRanks({ checked: false })
            await this._sst('storage', { modify_punksToShow: null })
            await this._sst('storage', { punksToShow: punks })
            this._sst('interf', { isLoading: false })
            this._sst('interf', { isOnlyHasBid: false })
        }
    }
    render() {
        const [CT] = this.context;
        const interf = this.state.interf
        const Punks = this.state.storage.modify_punksToShow || this.state.storage.punksToShow
        return (
            <>
                <div className="explorer">
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
                            {!interf.isOnlyHasBid &&
                                <div className="fast_filter">
                                    <label onClick={(e) => this.filterSortByRanks(e.target)} className="CheckBox">Sort by Rank
                                        <input type="checkbox" id="CHECK-SORT_BY_RANK" />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            }
                            <div className="fast_filter">
                                <label onClick={(e) => this.filterOnlyHasBid(e.target)} className="CheckBox">Only has Bid
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
                    <div className="body">
                        {interf.isLoading
                            ?
                            <C.Loading />
                            :
                            (Punks.length
                                ?
                                <C.Punker fixitems light connect punksData={Punks.slice(0, this.state.interf.lengthOfShowingPunks)} containerOptions={{ wrap: true }} />
                                :
                                'There is no any Punk for Sale')
                        }
                    </div>
                </div>
            </>
        )
    }
}