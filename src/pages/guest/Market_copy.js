import React, { Component } from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom';
import { BodyContext } from '~/context/BodyContext.js'
import { Watch, Actions } from '~/scripts'
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
                filterings_attributes: []
            },
            storage: {
                punks: null,
                punksToShow: null
            }
        }
    }
    componentWillMount() {
        const [CT] = this.context;
        CT.set_classing({
            route: 'market',
        });
        this.setState({
            storage: {
                ...this.state.storage,
                punks: CT.storage.PUNKS,
                punksToShow: CT.storage.PUNKS,
            }
        })
    }
    componentDidMount() {
        Watch.init(this);
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
        Swal.fire({
            title: '<div className="swal--head"> Filter </div>',
            icon: null,
            showCloseButton: true,
            html:
                `
                    <div className="swal--content">
                        <div className="filter_section">
                            ${Object.keys(CT.storage.FILTERS).map(filterGroup => {
                    return (`
                            <div className="title">
                                <span>
                                    ${filterGroup}
                                </span>
                            </div>
                            <div className="checklist">
                                ${Object.keys(CT.storage.FILTERS[filterGroup]).map(filter => {
                        return (`
                                <label className="CheckBox">${filter}
                                    <input type="checkbox" ${this.state.interf[`filterings_${filterGroup}`].includes(filter) ? 'checked' : ''} data-filter="${filterGroup}" data-value="${filter}" />
                                    <span className="checkmark"></span>
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
        let punksToShow = CT.storage.PUNKS_SORTED_BY_RANK
        const sortBy = CT.storage.RANKS

        await this._sst('interf', { filterings_attributes: [] })


        if (e.checked) {
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
    render() {
        const [CT] = this.context;
        const interf = this.state.interf
        const Punks = this.state.storage.punksToShow
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
                    <div className="body">
                        {Punks &&
                            <C.Punker fixitems light connect market punksData={Punks.slice(0, this.state.interf.lengthOfShowingPunks)} containerOptions={{ wrap: true }} />
                        }
                    </div>
                </div>
            </>
        )
    }
}