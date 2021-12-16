import React, { Component } from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom';
import { BodyContext } from '~/context/BodyContext.js'
import { Watch, Actions, WalletManager, Api } from '~/scripts'
import C from '~/components';
import Swal from 'sweetalert2';
import Scrollbars from 'react-custom-scrollbars';

export default class PunkPage extends Component {
    static contextType = BodyContext;
    constructor(props) {
        super(props)
        this.state = {
            interf: {
                id: props.match.params.id,
                rank: null,
                isBidding: false,
                isTransfering: false,
                isOffering: false,
                isBuying: false,
                isWithdrawing: false,
                isLoading: false,
                isCanceling: false,
                selectedWallet: 'METAMASK',
                wallet: {
                    isLoading: false,
                    name: null,
                },
                selectedWalletAddress : ''
            },
            storage: {
                bids: null,
                offer: null
            },
            form: {
            }
        }
    }
    componentWillMount() {
        const [CT] = this.context;
        this.CT = CT
        this.CT.set_classing({
            route: 'punkpage',
        });
    }
    async componentDidMount() {
        Watch.init(this);
        this._sst('interf', { isLoading: true })
        await this.state.interf.id == 0 ? this.getPunkZeroData() : this.getPunkData()
        await this.getPunkBids()
        await this.getPunkOffer()

        this._checkWalletConnect();
        setInterval(() => {
            this._checkWalletConnect();
        }, 1000);

        const selectedWallet = await WalletManager.getSelectedWallet();

        this._sst('interf', { isLoading: false, selectedWalletAddress : selectedWallet })
    }
    async _sst(main, obj, callback) {
        this.setState({
            [main]: {
                ...this.state[main],
                ...obj
            }
        }, () => callback ? callback() : null)
    }
    async _checkApprovalForAll() {
        const selectedWallet = await WalletManager.getSelectedWallet();
        try {
            return await window.contractGlobal.methods.isApprovedForAll(selectedWallet, this.CT.statics.contract.address).call()
        }
        catch (err) {
            console.log(err)
        }
    }
    async _submitAction() {
        this.state.interf.id && Api.get(`/update?token_id=${this.state.interf.id}`)
    }
    async _firstApproveThen(callback) {
        const selectedWallet = await WalletManager.getSelectedWallet();
        this.CT.swal(null, {
            title: 'Approval',
            body: `
            Do you accept Approval for Punks
        `,
            modify: {
                confirmButtonText: 'Yes',
                showDenyButton: true,
                denyButtonText: 'No'
            }
        }).then(async (res) => {
            await window.contract.methods.setApprovalForAll(this.CT.statics.contract.address, true).send({
                from: selectedWallet,
            }, (error, result) => {
                if (result) {
                    callback();
                } else {
                    this.CT.swal('error', {
                        title: 'Offer Rejected'
                    })
                }
                this._sst('interf', { isOffering: false })
            });
        }).catch(err => {
            this.CT.swal('error', {
                title: 'Offer Not completed'
            })
            this._sst('interf', { isOffering: false })
        })
    }
    _handleInput(evt) {
        var theEvent = evt || window.event;
        if (theEvent.type === 'paste') {
            key = theEvent.clipboardData.getData('text/plain');
        } else {
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }
    getPunkZeroData() {
        this.setState({
            interf: {
                ...this.state.interf,
                id: 0,
                type: 'Female',
                rank: 2118,
                attrs: ['Green Eye Shadow', 'Earring', 'Blonde Bob'],
                owner: '0xacC6346E0Fa68a0bE249E7C0Fb68aDb2cA87a0db',
            }
        })
        console.log(this.state.interf)
    }
    async getPunkData() {
        try {
            const selectedWallet = await WalletManager.getSelectedWallet();
            const owner = await window.contractGlobal.methods.ownerOf(this.state.interf.id).call()
            this._sst('interf', { itIsMine: owner.toLowerCase() === selectedWallet })
            this.CT.storage.PUNKS_SORTED_BY_RANK.map((punk, i) => {
                punk.idx == this.props.match.params.id && this.setState({
                    interf: {
                        ...this.state.interf,
                        id: punk.idx,
                        type: punk.type,
                        rank: punk.rank,
                        attrs: punk.attributes,
                        owner: owner,
                    }
                })
                return;
            })
        }
        catch (err) { }
    }
    async getPunkBids() {
        try {
            let bids = await window.contractGlobal.methods.punkBids(this.state.interf.id).call();
            this._sst('storage', { bids: bids[0] ? bids : null })
        } catch (e) {
            console.log(e);
        }
    }
    async getPunkOffer() {
        try {
            const offer = await window.contractGlobal.methods.punksOfferedForSale(this.state.interf.id).call()
            this._sst('storage', { offer: offer[0] ? offer : null })
        } catch (e) {
            console.log(e);
        }
    }
    connectToWallet() {
        setTimeout(() => {
            const _ = this;
            $('.swal-box .wallets .wallet').on('click', function () {
                console.log($(this).attr('data-wallet'))
                $('.swal-box .wallets .wallet').each(function () {
                    $(this).removeClass('-selected')
                })
                _._sst('interf', { selectedWallet: $(this).attr('data-wallet') })
                $(this).addClass('-selected')
            })
        }, 50);
        Swal.fire({
            title: '<div class="swal--head"> Choose your wallet </div>',
            icon: null,
            showCloseButton: true,
            html:
                `
                  <div class="swal--content">
                    <div class="wallets">
                        <a class="wallet ${this.state.interf.selectedWallet === 'METAMASK' ? '-selected' : ''}" data-wallet="METAMASK">
                            <div class="logo">
                                <div class="IC">
                                    <img src="${require('~/assets/images/pages/mint/metamask-logo.png').default}" />
                                </div>
                            </div>
                            <span>
                                metamask
                            </span>
                        </a>
                        <a class="wallet ${this.state.interf.selectedWallet === 'TRUSTWALLET' ? '-selected' : ''}" data-wallet="TRUSTWALLET">
                            <div class="logo">
                                <div class="IC">
                                    <img src="${require('~/assets/images/pages/mint/trustwallet-logo.png').default}" />
                                </div>
                            </div>
                            <span>
                                trustwallet
                            </span>
                        </a>
                    </div>
                  </div>  
                `,
            focusConfirm: false,
            customClass: {
                container: 'swal',
                popup: 'swal-box',
                title: 'swal--title',
                closeButton: 'swal-closebtn',
                denyButton: '',
                confirmButton: 'Btn -force',
                cancelButton: '',
            }
        })
            .then((result) => {
                if (result.isConfirmed) {
                    WalletManager.tryToConnect();
                }
            })
    }
    _checkWalletConnect() {
        let status = WalletManager.walletStatus;
        if (status === true) {
            this._sstForWallet(this.state.interf.wallet.isLoading, 'connected')
        } else if (status == null) {
            this._sstForWallet(this.state.interf.wallet.isLoading, '')
        }
    }
    _sstForWallet(isLoading, walletName) {
        this.setState({
            interf: {
                ...this.state.interf,
                wallet: {
                    isLoading: isLoading,
                    name: walletName
                }
            }
        })
    }
    async bridge_makeBid() {
        this.CT.swal(null, {
            title: 'Make a Bid',
            body: `
            <p>
                Enter Bid Price
            </p>
            <br />
            <div class="InputBox -full">
                <input type="text" placeholder="more than ${this.state.storage.bids ? window.web3.utils.fromWei(this.state.storage.bids.value) : '75'}" id="NEWBID-BID_PRICE" />
                <i class="ri-input-cursor-move"></i>
            </div>
            `,
            modify: {
                confirmButtonText: 'Accept'
            }
        }).then(async res => this._sst('form', { newbid_price: $('#NEWBID-BID_PRICE').val() }, () => {
            const reg = /^\d+$/;
            reg.test($('#NEWBID-BID_PRICE').val().split('.').join("")) ? this._makeBid() : this.CT.swal('warning', {
                title: 'Warning',
                body: `
                    <p>
                        Just enter the numbers
                    </p>
                `
            })
        }))
    }
    async _makeBid() {
        const { interf, form, storage } = this.state
        const selectedWallet = await WalletManager.getSelectedWallet();
        this._sst('interf', { isBidding: true })
        setTimeout(async () => {
            try {
                if (storage.bids && window.web3.utils.toWei(form.newbid_price) > storage.bids.value && form.newbid_price >= 75 || !storage.bids) {
                    await window.contract.methods.enterBidForPunk(interf.id).send({
                        from: selectedWallet,
                        value: window.web3.utils.toWei(form.newbid_price),
                    }, (error, result) => {
                        if (result) {
                            this.CT.swal('success', {
                                title: 'Bid successfully created',
                                body: `
                                    Refresh page after 'Enter Bid For Punk' Activity
                                `
                            })
                            this._submitAction()
                        } else {
                            this.CT.swal('error', {
                                title: 'Bid Rejected'
                            })
                        }
                        this._sst('interf', { isBidding: false })
                    });
                } else if (form.newbid_price < 75) {
                    this.CT.swal('error', {
                        title: `Bid value must be more than 75`,
                        body: `
                        `
                    })
                    this._sst('interf', { isBidding: false })
                } else {
                    this.CT.swal('error', {
                        title: `Bid value must be more than Active bid`,
                        body: `
                            ${storage.bids ? `Active Bid: ${window.web3.utils.fromWei(storage.bids.value)}` : ``} 
                        `
                    })
                    this._sst('interf', { isBidding: false })
                }
            } catch (e) {
                console.log(e);
            }
        }, 500);
    }
    async bridge_makeOffer() {
        this.CT.swal(null, {
            title: 'Offer it for sale',
            body: `
                <p>
                    Enter Offer Price
                </p>
                <br />
                <div class="InputBox -full">
                    <input type="text" placeholder="more than 75" id="MAKEOFFER-OFFER_PRICE" />
                    <i class="ri-input-cursor-move"></i>
                </div>
            `,
            modify: {
                confirmButtonText: 'Accept'
            }
        }).then(async res => this._sst('form', { newoffer_price: $('#MAKEOFFER-OFFER_PRICE').val() }, () => {
            const reg = /^\d+$/;
            reg.test($('#MAKEOFFER-OFFER_PRICE').val().split('.').join("")) ? this._makeOffer() : this.CT.swal('warning', {
                title: 'Warning',
                body: `
                    <p>
                        Just enter the numbers
                    </p>
                `
            })
        }))
    }
    async _makeOffer() {
        const { interf, form, storage } = this.state
        const selectedWallet = await WalletManager.getSelectedWallet();
        const isApproved = await this._checkApprovalForAll()
        this._sst('interf', { isOffering: true })
        setTimeout(async () => {
            try {
                if (form.newoffer_price >= 75) {
                    !isApproved ? this._firstApproveThen(() => _makeOfferNow()) : _makeOfferNow()
                } else {
                    this.CT.swal('error', {
                        title: 'New Offer value must be more than 75',
                        body: `
                        `
                    })
                    this._sst('interf', { isOffering: false })
                }
            } catch (e) {
                console.log(e);
            }
        }, 500);
        const _makeOfferNow = async () => {
            await window.contract.methods.offerPunkForSale(interf.id, window.web3.utils.toWei(form.newoffer_price)).send({
                from: selectedWallet,
            }, (error, result) => {
                if (result) {
                    this.CT.swal('success', {
                        title: 'New Offer successfully created',
                        body: `
                            Refresh page after 'Offer Punk For Sale' Activity
                        `
                    })
                    this._submitAction()
                } else {
                    this.CT.swal('error', {
                        title: 'Offer Rejected'
                    })
                }
                this._sst('interf', { isOffering: false })
            });
        }
    }
    async bridge_sellToBid() {
        this.CT.swal(null, {
            title: 'Accept Current Bid',
            body: `
                <p>
                    Do you Accept bid : ${this.state.storage.bids && window.web3.utils.fromWei(this.state.storage.bids.value)} ?
                </p>
            `,
            modify: {
                confirmButtonText: 'Yes'
            }
        }).then(async res => this._sellToBid())
    }
    async _sellToBid() {
        const { interf, form, storage } = this.state
        const selectedWallet = await WalletManager.getSelectedWallet();
        this._sst('interf', { isTransfering: true })
        const isApproved = await this._checkApprovalForAll()
        setTimeout(async () => {
            try {
                if (storage.bids) {
                    !isApproved ? this._firstApproveThen(() => _acceptBidForPunk()) : _acceptBidForPunk()
                }
            } catch (e) {
                console.log(e);
            }
        }, 500);
        const _acceptBidForPunk = async () => {
            await window.contract.methods.acceptBidForPunk(interf.id, 0).send({
                from: selectedWallet,
            }, (error, result) => {
                if (result) {
                    this.CT.swal('success', {
                        title: 'Punk Was Sold',
                        body: `
                            <p>
                                Punk was sold to ${this.CT.utils.walletAddress(storage.bids.bidder)}
                                <br />
                                Refresh page after 'Accept Bid For Punk' Activity
                            </p>
                        `
                    })
                    this._submitAction()
                } else {
                    this.CT.swal('error', {
                        title: 'Punk was not sold'
                    })
                }
                this._sst('interf', { isTransfering: false })
            });
        }
    }
    async bridge_withdrawBid() {
        this.CT.swal(null, {
            title: 'Withdraw Bid',
            body: `
                <p>
                    Do you Accept to Withdraw bid : ${this.state.storage.bids && window.web3.utils.fromWei(this.state.storage.bids.value)} ?
                </p>
            `,
            modify: {
                confirmButtonText: 'Yes'
            }
        }).then(async res => this._withdrawBid())
    }
    async _withdrawBid() {
        const { interf, form, storage } = this.state
        const selectedWallet = await WalletManager.getSelectedWallet();
        this._sst('interf', { isWithdrawing: true })
        setTimeout(async () => {
            try {
                if (storage.bids) {
                    await window.contract.methods.withdrawBidForPunk(interf.id).send({
                        from: selectedWallet,
                    }, (error, result) => {
                        if (result) {
                            this.CT.swal('success', {
                                title: 'Withdraw Bid Done',
                                body: `
                                    <p>
                                        Refresh page after 'Withdraw Bid For Punk' Activity
                                    </p>
                                `
                            })
                            this._submitAction()
                        } else {
                            this.CT.swal('error', {
                                title: 'Withdraw Bid was not accepted'
                            })
                        }
                        this._sst('interf', { isWithdrawing: false })
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }, 500);
    }
    async bridge_cancelOffer() {
        this.CT.swal(null, {
            title: 'Cancel Offer',
            body: `
                <p>
                    Do you Accept Offer Cancellation?
                </p>
            `,
            modify: {
                confirmButtonText: 'Yes'
            }
        }).then(async res => this._cancelOffer())
    }
    async _cancelOffer() {
        const { interf, form, storage } = this.state
        const selectedWallet = await WalletManager.getSelectedWallet();
        this._sst('interf', { isCanceling: true })
        setTimeout(async () => {
            try {
                await window.contract.methods.punkNoLongerForSale(interf.id).send({
                    from: selectedWallet,
                }, (error, result) => {
                    if (result) {
                        this.CT.swal('success', {
                            title: 'Punk no longer for Sale',
                            body: `
                                <p>
                                    Refresh page after 'Punk No Longer For Sale' Activity
                                </p>
                            `
                        })
                        this._submitAction()
                    } else {
                        this.CT.swal('error', {
                            title: 'Offer Cancellation failed'
                        })
                    }
                    this._sst('interf', { isCanceling: false })
                });
            } catch (e) {
                console.log(e);
            }
        }, 500);
    }
    async bridge_buybyOffer() {
        this.CT.swal(null, {
            title: 'Buy Punk',
            body: `
                <p>
                    Do you want to Buy Punk : #${this.state.interf.id}?
                </p>
            `,
            modify: {
                confirmButtonText: 'Yes'
            }
        }).then(async res => this._buybyOffer())
    }
    async _buybyOffer() {
        const { interf, form, storage } = this.state
        const selectedWallet = await WalletManager.getSelectedWallet();
        this._sst('interf', { isBuying: true })
        setTimeout(async () => {
            try {
                console.log(storage.offer)
                if (storage.offer) {
                    await window.contract.methods.buyPunk(interf.id).send({
                        from: selectedWallet,
                        value: storage.offer.minValue
                    }, (error, result) => {
                        if (result) {
                            this.CT.swal('success', {
                                title: 'Punk Was Bought',
                                body: `
                                    <p>
                                        Punk was bought for ${window.web3.utils.fromWei(storage.offer.minValue)}
                                        <br />
                                        Refresh page after 'Buy Punk' Activity
                                    </p>
                                `
                            })
                            this._submitAction()
                        } else {
                            this.CT.swal('error', {
                                title: 'Punk was not bought'
                            })
                        }
                        this._sst('interf', { isBuying: false })
                    });
                } else {
                    this.CT.swal('error', {
                        title: 'Punk has not any Offer'
                    })
                }
            } catch (e) {
                console.log(e);
            }
        }, 500);
    }
    render() {
        const interf = this.state.interf
        const storage = this.state.storage
        const props = this.props
        const selectedWallet = interf.selectedWalletAddress
        return (
            !interf.isLoading
                ?
                <>
                    <div className="punk_details">
                        <div className="profile">
                            <div className="profile_picture">
                                <div className="IC">
                                    <img src={`https://polypunks.app/punks/pic/${props.match.params.id}.png`} alt="" />
                                </div>
                            </div>
                            <div className="profile_info">
                                <div className="record name">
                                    <div className="key">
                                        <span>
                                            Name
                                        </span>
                                    </div>
                                    <div className="value">
                                        <span>
                                            #{props.match.params.id}
                                        </span>
                                    </div>
                                </div>
                                <div className="record attrs">
                                    <div className="key">
                                        <span>
                                            Attributes
                                        </span>
                                    </div>
                                    <div className="value">
                                        {interf.attrs && interf.attrs.map((attr, id) => {
                                            return (
                                                <div className="attr" key={id}>
                                                    <span>{attr}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="record owner">
                                    <div className="key">
                                        <span>
                                            Owner
                                        </span>
                                    </div>
                                    <div className="value">
                                        {interf.owner && <a href={`https://explorer-mainnet.maticvigil.com/address/${interf.owner}`} target="_blank">
                                            <span>
                                                {interf.owner.toLowerCase() === selectedWallet ? 'me' : this.CT.utils.walletAddress(interf.owner)}
                                            </span>
                                        </a>}
                                    </div>
                                </div>
                                {storage.offer &&
                                    <div className="record price">
                                        <div className="key">
                                            <span>
                                                Offered Price
                                            </span>
                                        </div>
                                        <div className="value">
                                            <span>
                                                {storage.offer.minValue && window.web3Global.utils.fromWei(storage.offer.minValue)} MATIC
                                            </span>
                                        </div>
                                    </div>
                                }
                                <div className="record rank">
                                    <div className="key">
                                        <span>
                                            Rank
                                        </span>
                                    </div>
                                    <div className="value">
                                        <span>
                                            {interf.rank || ''}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {selectedWallet
                            ?
                            <div className={`actions ${interf.itIsMine ? '-mine' : ''}`}>
                                {interf.itIsMine
                                    ?
                                    <>
                                        <div className="description">
                                            <p>
                                                IT IS MINE
                                            </p>
                                        </div>
                                        <div className="Actions">
                                            {interf.isOffering
                                                ?
                                                <a className="Btn -simple">
                                                    <span>
                                                        Wait...
                                                    </span>
                                                </a>
                                                :
                                                <a className="Btn -simple2" onClick={() => this.bridge_makeOffer()}>
                                                    <i className="ri-add-circle-line"></i>
                                                    <span>
                                                        {!storage.offer ? 'Offer it for sale' : 'Change Offer'}
                                                    </span>
                                                </a>
                                            }

                                            {interf.isTransfering
                                                ?
                                                <a className="Btn">
                                                    <span>
                                                        Wait...
                                                    </span>
                                                </a>
                                                :
                                                (storage.bids &&
                                                    <a className="Btn" onClick={() => this.bridge_sellToBid()}>
                                                        <i className="ri-exchange-dollar-line"></i>
                                                        <span>
                                                            Accept Current Bid ({storage.bids.value && window.web3.utils.fromWei(storage.bids.value)})
                                                        </span>
                                                    </a>)
                                            }

                                            {storage.offer &&
                                                (interf.isCanceling
                                                    ?
                                                    <a className="Btn">
                                                        <span>
                                                            Wait...
                                                        </span>
                                                    </a>
                                                    :
                                                    <a className="Btn" onClick={() => this.bridge_cancelOffer()}>
                                                        <i className="ri-close-circle-line"></i>
                                                        <span>
                                                            Cancel Offer
                                                        </span>
                                                    </a>
                                                )
                                            }
                                        </div>
                                    </>
                                    :
                                    <>
                                        <div className="description">
                                            <p>
                                                You can buy and accept offer, or make a Bid {!storage.offer && 'after owner Offer'}
                                            </p>
                                        </div>
                                        <div className="Actions">
                                            {interf.isBidding
                                                ?
                                                <a className="Btn -simple">
                                                    <span>
                                                        Wait...
                                                    </span>
                                                </a>
                                                :
                                                (
                                                    // storage.offer &&
                                                    props.match.params.id != 0 &&
                                                    <a className="Btn -simple2" onClick={() => this.bridge_makeBid()}>
                                                        <i className="ri-currency-line"></i>
                                                        <span>
                                                            Make a Bid
                                                        </span>
                                                    </a>)
                                            }
                                            {
                                                storage.offer &&
                                                props.match.params.id != 0 &&
                                                (interf.isBuying
                                                    ?
                                                    <a className="Btn">
                                                        <i className="ri-bank-card-line"></i>
                                                        <span>
                                                            Wait...
                                                        </span>
                                                    </a>
                                                    :
                                                    <a className="Btn" onClick={() => this.bridge_buybyOffer()}>
                                                        <i className="ri-bank-card-line"></i>
                                                        <span>
                                                            Buy
                                                        </span>
                                                    </a>)
                                            }
                                        </div>
                                    </>
                                }

                            </div>
                            :
                            <div className={`actions ${interf.itIsMine ? '-mine' : ''}`}>
                                <div className="description">
                                    <p>
                                        Connect your wallet for activity in market
                                    </p>
                                </div>
                                <div className="Actions" onClick={() => this.connectToWallet()}>
                                    <a className="Btn">
                                        <span>
                                            Connect
                                        </span>
                                    </a>
                                </div>
                            </div>
                        }
                        <div className="data">
                            <div className="table offers">
                                <div className="title">
                                    <i className="ri-list-ordered"></i>
                                    <span>
                                        Offered
                                    </span>
                                </div>
                                <div className="c-">
                                    <C.Content full>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>From</th>
                                                    <th>Amount</th>
                                                    {/* <th>Txn</th> */}
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {storage.offer
                                                    ?
                                                    <tr>
                                                        <td>{storage.offer.seller && <a href={`https://explorer-mainnet.maticvigil.com/address/${storage.offer.seller}`} target="_blank">{storage.offer.seller.toLowerCase() === selectedWallet ? 'me' : this.CT.utils.walletAddress(storage.offer.seller)}</a>}</td>
                                                        <td>{storage.offer.minValue && window.web3Global.utils.fromWei(storage.offer.minValue)}</td>
                                                        {/* <td><a href="https://google.com" target="_blank">unknown</a></td> */}
                                                        <td>
                                                            {storage.offer.isForSale
                                                                ?
                                                                <span className="status -success">Current</span>
                                                                :
                                                                <span className="status -error">Canceled</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    :
                                                    <div className="isEmpty">
                                                        <span>
                                                            it's Empty
                                                        </span>
                                                    </div>
                                                }
                                            </tbody>
                                        </table>
                                    </C.Content>
                                </div>
                            </div>
                            <div className="table bids">
                                <div className="title">
                                    <i className="ri-stack-line"></i>
                                    <span>
                                        Current Bid
                                    </span>
                                </div>
                                <div className="c-">
                                    <C.Content full>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>From</th>
                                                    <th>Amount</th>
                                                    {/* <th>Txn</th> */}
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {storage.bids
                                                    ?
                                                    <tr>
                                                        <td>{storage.bids.bidder && <a href={`https://explorer-mainnet.maticvigil.com/address/${storage.bids.bidder}`} target="_blank">{storage.bids.bidder.toLowerCase() === selectedWallet ? 'me' : this.CT.utils.walletAddress(storage.bids.bidder)}</a>}</td>
                                                        <td>{storage.bids.value && window.web3Global.utils.fromWei(storage.bids.value)}</td>
                                                        {/* <td><a href="https://google.com" target="_blank">unknown</a></td> */}
                                                        <td>
                                                            {storage.bids.hasBid
                                                                ?
                                                                (selectedWallet == storage.bids.bidder.toLowerCase() ? <a onClick={() => interf.isWithdrawing ? null : this.bridge_withdrawBid()} className="status Btn -success"><span>{interf.isWithdrawing ? 'Wait...' : 'Withdraw'}</span></a> : <span className="status -success">Current</span>)
                                                                :
                                                                <span className="status -error">Canceled</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    :
                                                    <div className="isEmpty">
                                                        <span>
                                                            it's Empty
                                                        </span>
                                                    </div>
                                                }
                                            </tbody>
                                        </table>
                                    </C.Content>
                                </div>
                            </div>
                            {/* <div className="table history">
                            <div className="title">
                                <i className="ri-arrow-up-down-line"></i>
                                <span>
                                    Trading History
                                </span>
                            </div>
                            <div className="c-">
                                <C.Content full>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Event</th>
                                                <th>Price</th>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Txn</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            Coming Soon
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                            <tr>
                                                <td>Sale</td>
                                                <td>3100 MATICS</td>
                                                <td><a href="https://google.com" target="_blank">wascawgr45</a></td>
                                                <td><a href="https://google.com" target="_blank">0x42csacacascs5</a></td>
                                                <td><a href="https://google.com" target="_blank">2021/03/21</a></td>
                                                <td><span className="status -success">Done</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </C.Content>
                            </div>
                        </div> */}
                        </div>
                    </div>
                    <C.Footer />
                </>
                :
                <C.Loading />
        )
    }
}