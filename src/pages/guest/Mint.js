import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import { BodyContext } from '~/context/BodyContext.js'
import Swal from 'sweetalert2'
import { Watch, Actions, WalletManager } from '~/scripts'
import C from '~/components';
// import VConsole from 'vconsole';
// const vConsole = new VConsole();

export default class Mint extends Component {
    static contextType = BodyContext;
    constructor() {
        super()
        this.state = {
            interf: {
                selectedWallet: 'METAMASK',
                wallet: {
                    isLoading: false,
                    name: null,
                }
            },
            storage: {

            },
            form: {
                punksCount: 1
            },
            PunkLeft: '',
        }
    }
    componentWillMount() {
        const [CT] = this.context;
        CT.set_classing({
            route: 'mint',
        });
    }

    componentDidMount() {
        Watch.init(this);
        // Actions.checkWalletConnection()
        //     .then(wallet => {
        //         this._sstForWallet(true, wallet)
        //     })
        //     .catch(err => {
        //         this._sstForWallet(true, null)
        //     })


        this.checkPunkLeft();

        setTimeout(async () => {
            await this.checkPunkLeft();
        }, 10000);

        this.checkWalletConnect();
        setInterval(() => {
            this.checkWalletConnect();
        }, 1000);




        // // 
        // const _ = this
        // $(function () {
        //     $('.dropdown ul li').on('click', function () {
        //         var label = $(this).parent().parent().children('label');
        //         label.attr('data-value', $(this).attr('data-value'));
        //         label.html($(this).html());

        //         $(this).parent().children('.selected').removeClass('selected');
        //         $(this).addClass('selected');
        //         _.setPunksCount($(this).html())
        //     });
        // });
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
    _sst(main, obj) {
        this.setState({
            [main]: {
                ...this.state[main],
                ...obj
            }
        })
    }
    setPunksCount(value) {
        this._sst('form', { punksCount: value })
    }
    connectToWallet() {
        // Listener for Wallet select
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

        // Open Popup for select wallet
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
            // showConfirmButton: false,
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
                    // // this._sstForWallet(false, null)
                    // Actions.connectToWallet('wallet_name')
                    //     .then(wallet => {
                    //         this._sstForWallet(true, wallet)
                    //     })
                    //     .catch(err => {
                    //         this._sstForWallet(true, null)
                    //         Swal.fire({
                    //             title: '<div class="swal--head"> Mint not accepted! </div>',
                    //             icon: 'error',
                    //             showCloseButton: true,
                    //             html:
                    //                 `
                    //                   <div class="swal--content">
                    //                     <p>
                    //                         ${err.msg}
                    //                     </p>
                    //                   </div>
                    //                 `,
                    //             focusConfirm: false,
                    //             customClass: {
                    //                 container: 'swal',
                    //                 popup: 'swal-box',
                    //                 title: 'swal--title',
                    //                 closeButton: 'swal-closebtn',
                    //                 denyButton: '',
                    //                 confirmButton: 'Btn -force',
                    //                 cancelButton: '',
                    //             }
                    //         })
                    //     })

                    WalletManager.tryToConnect();

                } else if (result.isDenied) {
                }
            })
    }
    async mint() {

        try {

            this._sstForWallet(true, this.state.interf.wallet.name);
            let selectedWallet = "";
            try {
                selectedWallet = window.web3Global.currentProvider.selectedAddress;
            } catch (e) {
                console.log("1", e);
            }
            console.log(selectedWallet);
            if (selectedWallet) {
                await this._mint(selectedWallet);
            } else {
                window.web3Global.eth.getAccounts((error, result) => {
                    if (error) {
                        console.log(":|", error);
                    } else {
                        this._mint(result[0])
                    }
                });
            }


        } catch (e) {
            this._sstForWallet(false, this.state.interf.wallet.name);
            this._sst('form', { punksCount: 1 })
            console.log(";(", e);
        }

        // this._sstForWallet(false, this.state.interf.wallet.name)
        // Actions.mint(this.state.form.punksCount)
        //     .then(wallet => {
        //         this._sstForWallet(true, this.state.interf.wallet.name)
        //         Swal.fire({
        //             title: `<div class="swal--head"> Mint accepted successfully </div>`,
        //             icon: 'success',
        //             showCloseButton: true,
        //             html:
        //                 `
        //               <div class="swal--content">
        //                 ${this.state.form.punksCount} punks minted
        //               </div>
        //             `,
        //             focusConfirm: false,
        //             customClass: {
        //                 container: 'swal',
        //                 popup: 'swal-box',
        //                 title: 'swal--title',
        //                 closeButton: 'swal-closebtn',
        //                 denyButton: '',
        //                 confirmButton: 'Btn -force',
        //                 cancelButton: '',
        //             }
        //         })
        //             .then((result) => {
        //                 this.setState({
        //                     form: {
        //                         ...this.state.form,
        //                         punksCount: null
        //                     }
        //                 })
        //             })
        //     })
    }

    async _mint(wallet) {

        console.log('>', wallet);

        if (!wallet) {
            console.log('here !');
            WalletManager.walletStatus = null;
            WalletManager.disconnect();
            this._sstForWallet(false, this.state.interf.wallet.name);
            this._sst('form', { punksCount: 1 })
            return;
        }


        try {
            window.contract.methods.mint(this.state.form.punksCount).send({
                from: wallet,
                value: window.web3Global.utils.toWei((this.state.form.punksCount * 75) + ""),
            }, (error, result) => {

                console.log("=========>>", error, result);

                if (!error) {
                    Swal.fire({
                        title: `<div class="swal--head"> Mint accepted successfully </div>`,
                        icon: 'success',
                        showCloseButton: true,
                        focusConfirm: false,
                        html:
                            `
                                  <div class="swal--content">
                                    <p>Your transaction broadcast to network</p>
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
                        }
                    })
                    // toastr.success("Your transaction broadcast to network");
                } else {
                    Swal.fire({
                        title: `<div class="swal--head"> Mint not complete </div>`,
                        icon: 'warning',
                        showCloseButton: true,
                        focusConfirm: false,
                        html:
                            `
                                  <div class="swal--content">
                                    <p>${(typeof error === 'string' ? error : "")}</p>
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
                        }
                    })

                    // toastr.error("Transaction not complete");
                }

                this._sstForWallet(false, this.state.interf.wallet.name);
                this._sst('form', { punksCount: 1 })
            });

        } catch (e) {
            this._sstForWallet(false, this.state.interf.wallet.name);
            this._sst('form', { punksCount: 1 })
            console.log(e);
        }

        // this._sstForWallet(false, this.state.interf.wallet.name)
        // Actions.mint(this.state.form.punksCount)
        //     .then(wallet => {
        //         this._sstForWallet(true, this.state.interf.wallet.name)
        //         Swal.fire({
        //             title: `<div class="swal--head"> Mint accepted successfully </div>`,
        //             icon: 'success',
        //             showCloseButton: true,
        //             html:
        //                 `
        //               <div class="swal--content">
        //                 ${this.state.form.punksCount} punks minted
        //               </div>
        //             `,
        //             focusConfirm: false,
        //             customClass: {
        //                 container: 'swal',
        //                 popup: 'swal-box',
        //                 title: 'swal--title',
        //                 closeButton: 'swal-closebtn',
        //                 denyButton: '',
        //                 confirmButton: 'Btn -force',
        //                 cancelButton: '',
        //             }
        //         })
        //             .then((result) => {
        //                 this.setState({
        //                     form: {
        //                         ...this.state.form,
        //                         punksCount: null
        //                     }
        //                 })
        //             })
        //     })
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
    checkWalletConnect() {
        let status = WalletManager.walletStatus;
        if (status === true) {
            this._sstForWallet(this.state.interf.wallet.isLoading, 'connected')
        } else if (status == null) {
            this._sstForWallet(this.state.interf.wallet.isLoading, '')
        }
    }
    render() {
        const interf = this.state.interf
        const form = this.state.form
        return (
            <>
                <div className="minter">
                    <div className="imager">
                        <div className="IC">
                            <img src={require('~/assets/images/pages/mint/hero_image.png').default} alt="" />
                        </div>
                    </div>
                    <div className="body">
                        <div className="title">
                            <span>
                                Mint some PolyPunks
                            </span>
                        </div>
                        <div className="description">
                            <p>
                                Total random distribution
                            </p>
                            <p className="secondP">
                                75 matic to mint a polypunk
                            </p>
                            <p>
                                PolyPunks left: {this.state.PunkLeft}
                            </p>
                        </div>
                        <div className="act">
                            {!interf.wallet.isLoading
                                ?
                                !interf.wallet.name
                                    ?
                                    <>
                                        <div className="Actions">
                                            <a className="Btn" onClick={() => this.connectToWallet()}>
                                                <i className="ri-link-m"></i>
                                                <span>
                                                    Connect to Wallet
                                                </span>
                                            </a>
                                        </div>
                                    </>
                                    :
                                    <>
                                        {/* <div className="InputBox" style={{
                                            width: 'auto',
                                            flexDirection: 'column'
                                        }}>
                                            <div className="box">
                                                <select defaultValue="1" value={form.punksCount || "1"} className="dropdown" id="punks_number" name="punks_number" onChange={(e) => this.setPunksCount(e.target.value)} >
                                                    <option value="1">1 x Polypunk</option>
                                                    <option value="2">2 x Polypunk</option>
                                                    <option value="5">5 x Polypunk</option>
                                                    <option value="10">10 x Polypunk</option>
                                                    <option value="20">20 x Polypunk</option>
                                                </select>
                                            </div>
                                        </div> */}
                                        {form.punksCount &&
                                            <Link className="Btn" to={'/market'}>
                                                <i className="ri-error-warning-line"></i>
                                                <span>
                                                    Punks Minted, Go to Market
                                                </span>
                                            </Link>
                                            // <a className="Btn" onClick={() => this.mint()}>
                                            //     <i className="ri-bank-card-2-line"></i>
                                            //     <span>
                                            //         Mint
                                            //     </span>
                                            // </a>
                                        }
                                    </>
                                :
                                'Loading...'
                            }
                        </div>
                    </div>
                </div>
            </>
        )
    }
}