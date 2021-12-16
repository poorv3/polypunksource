import $ from 'jquery';

class Actions {
    checkWalletConnection() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (false) {
                    resolve('wallet_name')
                } else {
                    reject({ msg: 'error msg' })
                }
            }, 1000);
        })
    }
    connectToWallet(wallet) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (true) {
                    resolve('wallet_name')
                } else {
                    reject({ msg: 'error msg' })
                }
            }, 1000);
        })
    }
    mint(count) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (true) {
                    resolve('wallet_name')
                } else {
                    reject({ msg: 'error msg' })
                }
            }, 1000);
        })
    }
    getMyPunks() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (true) {
                    resolve('wallet_name', ['punks_data'])
                } else {
                    reject({ msg: 'error msg' })
                }
            }, 1000);
        })
    }
    // 
}
export default new Actions();