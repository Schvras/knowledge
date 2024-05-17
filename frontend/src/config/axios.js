import axios from 'axios'

const success = res => res
const error = err => {
    console.log()
    if (401 === err.response.status && window.location.pathname !== '/auth'){
        window.location = '/auth'
    } else {
        return Promise.reject(err)
    }
}

axios.interceptors.response.use(success, error)