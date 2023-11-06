import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { getUser } from '../helpers/api'

//axios.defaults.baseURL = import.meta.env.VITE_LOCALHOST_SERVER_API
axios.defaults.baseURL = import.meta.env.VITE_LIVE_SERVER_API


/**Get User Details Hooks */
export function useFetch(query){
    const [data, setData] = useState({ isLoading: true, apiData: null, status: null, serverError: null})

    useEffect(() => {
        const fetchData =  async () => {
            try {
                const { id } = !query ? await getUser() : await getUser();
                
                const config = {
                    headers: {
                      Authorization: `Bearer ${id}`,
                    },
                  };            

                const { data, status} = !query ? await axios.get(`/api/user/${id}`, config) : await axios.get(`/api/getUsers/${id}`, config)
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

    useEffect(() => {
        const fetchData =  async () => {
            try {
                const { id } = !query ? await getUser() : await getUser();
                
                const config = {
                    headers: {
                      Authorization: `Bearer ${id}`,
                    },
                  };            

                const { data, status} = !query ? await axios.get(`/api/user/story/${id}`, config) : await axios.get(`/api/getUsers/story/${id}`, config)
                console.log('Data from Hooks>>>', data)

                if(status === 200){
                    setData({ isLoadingStory: false, apiUserStoryData: data, storyStatus: status, storyServerError: null})
                } else{
                    setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: status, storyServerError: null})
                }
            } catch (error) {
                setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: null, storyServerError: error})
            }
        };
        fetchData()
    }, [query])

    return data
}