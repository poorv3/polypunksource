class Auth {
    constructor() {
    }
    login(token) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                localStorage.setItem('user_token', token);
                resolve();
            }, 1000);
        })
    }
    logout() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                localStorage.removeItem('user_token');
                localStorage.clear();
                resolve();
            }, 1000);
        })
    }
    isAuth() {
        var session_info = localStorage.getItem('user_token');
        if (session_info !== null) {
            return true;
        } else {
            return false;
        }
    }
}
export default new Auth();