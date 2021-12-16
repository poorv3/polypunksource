import axios from 'axios';
class Api {
    base_url = 'https://polypunks.app/backend';
    get(url) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: this.base_url + `${url}`,
                headers: {}
            })
                .then(
                    res => {
                        if (res.status === 200) {
                            resolve(JSON.parse(res.data.msg))
                        }
                    }
                )
                .catch(
                    err => {
                        if (err.response) {
                            if (err.response.status !== 200) {
                                reject(err.response.data)
                            }
                        } else if (err.request) {
                            // Error
                        }
                    }
                )
        })
    }
    post(url, data) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: this.base_url + `${url}`,
                headers: {},
                data: data
            })
                .then(
                    res => {
                        if (res.status === 200) {
                            resolve(res.data);
                        }
                    }
                )
                .catch(
                    err => {
                        if (err.response) {
                            if (err.response.status !== 200) {
                                reject(err.response.data)
                            }
                        } else if (err.request) {
                            // Error
                        }
                    }
                )
        })
    }
}
export default new Api();