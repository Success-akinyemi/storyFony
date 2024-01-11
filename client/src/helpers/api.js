import axios from 'axios'
import jwt_decode from 'jwt-decode'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

//axios.defaults.baseURL = import.meta.env.VITE_LOCALHOST_SERVER_API
axios.defaults.baseURL = import.meta.env.VITE_LIVE_SERVER_API



const token = localStorage.getItem('accessToken')

export async function getUser(){
    if(!token) return Promise.reject('Cannot get Token')
    try {
        const decoded = jwt_decode(token);
        //console.log('decoded>>', decoded);
        
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
        const res = await axios.post('/api/login', { email, password }, {withCredentials: true} )
        console.log('respones', res)
        if(res.data){
            return res        
        }
    } catch (error) {
        console.log('ERROR REGISTERING USER API', error)
        if (error.response) {
            const errorMsg = error.response.data.data;
            console.log('MSGS', errorMsg)
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function verifyUser({ id, token}){
    try {
        const res = await axios.post(`/api/${id}/verify/${token}`, { withCredentials: true })
        
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

export async function createStory({title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded}){
    try {
        const res = await axios.post('/api/create-story', {title, desc, motive, genreValue, ending, mimicAuthor, numberOfSeries, language, userEmail, totalInkNeeded}, { withCredentials: true })
        console.log('CREATE STORY RES', res)
        if(res?.data.success){
            toast.success('Story Generated')
            return res
        }
    } catch (error) {
        console.log('ERROR CREATING USER STORY', error)
        if (error.response && error.response.data) {
            const errorMsg = error.response.data.data;
            const errorStatus = error.response.status;
            console.log('MSG', errorMsg)
            if(errorStatus === 401 || errorStatus === 403){
                window.location.href = '/login'
            }
            toast.error(errorMsg)
            return errorMsg;
          } else {
            return 'An error occurred during the request.';
          }
    }
}

export async function handlePrivateStory({id}){
    try {
        const res = await axios.post(`/api/user/story/handlePrivateStory/${id}`, {headers: {Authorization: `Bearer ${token}`}})
        console.log('HANDLE PRIVATE STORY', res)
        if(res?.data.success){
            toast.success('Story Updated')
            return res
        }
    } catch (error) {
        console.log('ERROR HANDLING USER PRIVATE STORY', error)
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