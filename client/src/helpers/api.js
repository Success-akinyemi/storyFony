import axios from 'axios'
import jwt_decode from 'jwt-decode'
import toast from 'react-hot-toast'

axios.defaults.baseURL = 'http://localhost:9000'

const token = localStorage.getItem('accessToken')

export async function getUser(){
    if(!token) return Promise.reject('Cannot get Token')
    try {
        const decoded = jwt_decode(token);
        console.log('decoded>>', decoded);
        
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return Promise.reject('Error decoding token');
      }
}

export async function resgisterUser({ fisrtName, lastName, email, penName ,password }){
    try {
        const res = await axios.post('/api/register', { fisrtName, lastName, email, penName ,password })

        console.log('respones', res)
        if(res.data.success){
            return res        
        }
    } catch (error) {
        console.log('ERROR REGISTERING USER', error)
        const errorMsg = error.res.data.data
        return errorMsg
    }
}

export async function loginUser({ email, password }){
    try {
        const res = await axios.post('/api/login', { email, password })
        console.log('respones', res)
        if(res.data){
            return res        
        }
    } catch (error) {
        console.log('ERROR REGISTERING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function verifyUser({ id, token}){
    try {
        const res = await axios.post(`/api/${id}/verify/${token}`)
        console.log(res)
        if(res.data.success){
            localStorage.setItem('accessToken', res.data.token)
            toast.success('Email Verified')
            return res
        }
    } catch (error) {
        console.log('ERROR VERIFYING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function resetPassword ({ email }){
    try {
        const res = await axios.post('/api/forgotPassword', { email })
        console.log('RES FROM FORGOT PASSWROD', res)
        if(res.data.success){
            return res
        }
    } catch (error) {
        console.log('ERROR VERIFYING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function newPassword({ resetToken, password }){
    try {
        const res = await axios.put(`/api/resetPassword/${resetToken}`, {password})

        if(res.data.success){
            toast.success(res.data.data)
            return res
        }
    } catch (error) {
        console.log('ERROR VERIFYING USER API', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            console.log('MSG', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}