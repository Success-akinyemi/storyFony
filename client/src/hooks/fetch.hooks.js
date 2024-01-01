import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getUser } from '../helpers/api'
import { useSelector } from 'react-redux'

//axios.defaults.baseURL = import.meta.env.VITE_LOCALHOST_SERVER_API
axios.defaults.baseURL = import.meta.env.VITE_LIVE_SERVER_API

const token = localStorage.getItem('accessToken')
/**Get User Details Hooks */
export function useFetch(query){
    const [data, setData] = useState({ isLoading: true, apiData: null, status: null, serverError: null})

    useEffect(() => {
        const fetchData =  async () => {
            try {
                const { id } = !query ? await getUser() : await getUser();        

                const { data, status} = !query ? await axios.get(`/api/user/${id}`, { withCredentials: true }) : await axios.get(`/api/getUsers/${id}`, { withCredentials: true })
                console.log('Data from Hooks>>>', data)

                if(status === 200){
                    setData({ isLoading: false, apiData: data, status: status, serverError: null})
                } else{
                    setData({ isLoading: false, apiData: null, status: status, serverError: null})
                }
            } catch (error) {
                setData({ isLoading: false, apiData: null, status: null, serverError: error})
            }
        };
        fetchData()
    }, [query])

    return data
}

/**Get User Story Hooks */
export function userStoryBook(query){
    const [data, setData] = useState({ isLoadingStory: true, apiUserStoryData: null, storyStatus: null, storyServerError: null})
    const  {currentUser}  = useSelector(state => state.user)
    const user = currentUser?.data
    const id = user?._id
    useEffect(() => {
        const fetchData =  async () => {
            try {
                console.log('ID', id, 'QUERY', query)          

                const { data, status} = !query ? await axios.get(`/api/user/stories/${id}`, { withCredentials: true }) : await axios.get(`/api/user/story/${id}/${query}`, { withCredentials: true })
                console.log('Story Data from Hooks>>>', data)

                if(status === 200){
                    setData({ isLoadingStory: false, apiUserStoryData: data, storyStatus: status, storyServerError: null})
                } else{
                    setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: status, storyServerError: null})
                }
            } catch (error) {
                setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: error.response?.status, storyServerError: error.response?.data?.data ? error.response?.data?.data : error })
                console.log(data)
                console.log(error)
            }
        };
        fetchData()
    }, [query])

    return data
}