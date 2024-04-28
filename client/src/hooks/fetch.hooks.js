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

                const { data, status} = !query ? await axios.get(`/api/admin/getUsers`, { withCredentials: true }) : await axios.get(`/api/admin/getUser/${query}`, { withCredentials: true })
                //console.log('Data from Hooks>>>', data)

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
export function userStoryBook(query) {
    const [data, setData] = useState({ isLoadingStory: true, apiUserStoryData: null, storyStatus: null, storyServerError: null });
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const id = user?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (!query) {
                    // If there is no query, fetch all stories for the user
                    url = `/api/user/stories/${id}`;
                } else {
                    // If there is a query, fetch a specific story
                    const { userId, storyId } = query;
                    url = `/api/user/story/${userId}/${storyId}`;
                }

                //console.log('ID', id, 'QUERY', query);
                const { data, status } = await axios.get(url, { withCredentials: true });
                //console.log('Story Data from Hooks>>>', data);

                if (status === 200) {
                    setData({ isLoadingStory: false, apiUserStoryData: data, storyStatus: status, storyServerError: null });
                } else {
                    setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: status, storyServerError: null });
                }
            } catch (error) {
                setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: error.response?.status, storyServerError: error.response?.data?.data ? error.response?.data?.data : error });
                //console.log(data);
                console.log(error);
            }
        };

        fetchData();
    }, [query]);

    return data;
}

export function userStoryBookEditor(query) {
    const [data, setData] = useState({ isLoadingStory: true, apiUserStoryData: null, storyStatus: null, storyServerError: null });
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const id = user?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (!query) {
                    // If there is no query, fetch all stories for the user
                    url = `/api/user/stories/${id}`;
                } else {
                    // If there is a query, fetch a specific story
                    const { userId, storyId } = query;
                    url = `/api/user/story/edit/${userId}/${storyId}`;
                }

                //console.log('ID', id, 'QUERY', query);
                const { data, status } = await axios.get(url, { withCredentials: true });
                //console.log('Edit Story Data from Hooks>>>', data);

                if (status === 200) {
                    setData({ isLoadingStory: false, apiUserStoryData: data, storyStatus: status, storyServerError: null });
                } else {
                    setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: status, storyServerError: null });
                }
            } catch (error) {
                setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: error.response?.status, storyServerError: error.response?.data?.data ? error.response?.data?.data : error });
                //console.log(data);
                console.log(error);
            }
        };

        fetchData();
    }, [query]);

    return data;
}

/**Get User Liked Stories */
export function userLikedStory(query) {
    const [data, setData] = useState({ isLoadingStory: true, apiUserStoryData: null, storyStatus: null, storyServerError: null });
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const id = user?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (!query) {
                    // If there is no query, fetch all stories for the user
                    url = `/api/user/likedStories/${id}`;
                } else {
                    // If there is a query, fetch a specific story
                    const { userId, storyId } = query;
                    url = `/api/user/story/${userId}/${storyId}`;
                }

                //console.log('ID', id, 'QUERY', query);
                const { data, status } = await axios.get(url, { withCredentials: true });
                //console.log('Story Data from Hooks>>>', data);

                if (status === 200) {
                    setData({ isLoadingStory: false, apiUserStoryData: data, storyStatus: status, storyServerError: null });
                } else {
                    setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: status, storyServerError: null });
                }
            } catch (error) {
                setData({ isLoadingStory: false, apiUserStoryData: null, storyStatus: error.response?.status, storyServerError: error.response?.data?.data ? error.response?.data?.data : error });
                //console.log(data);
                console.log(error);
            }
        };

        fetchData();
    }, [query]);

    return data;
}

/**Get Princing Details */
export function useFetchPrice(query){
    const [data, setData] = useState({ isLoading: true, apiData: null, status: null, serverError: null})

    useEffect(() => {
        const fetchData =  async () => {
            try {

                const { data, status} = await axios.get(`/api/subscription/prices`, { withCredentials: true })
                //console.log('Price Data from Hooks>>>', data)

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

/**Get user subscription histroy */
export function fetchUserSubscription(query) {
    const [data, setData] = useState({ isLoadingSub: true, apiSubData: null, subStatus: null, subServerError: null });
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const id = user?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (!query) {
                    // If there is no query, fetch all stories for the user
                    url = `/api/subscription/subHistroy/${id}`;
                } else {
                    // If there is a query, fetch a specific story
                    const { userId, storyId } = query;
                    url = `/api/subscription/${id}/${id}`;
                }

                //console.log('ID', id, 'QUERY', query);
                const { data, status } = await axios.get(url, { withCredentials: true });
                //console.log('Story Data from Hooks>>>', data);

                if (status === 200) {
                    setData({ isLoadingSub: false, apiSubData: data, subStatus: status, subServerError: null });
                } else {
                    setData({ isLoadingSub: false, apiSubData: null, subStatus: status, subServerError: null });
                }
            } catch (error) {
                setData({ isLoadingSub: false, apiSubData: null, subStatus: error.response?.status, subServerError: error.response?.data?.data ? error.response?.data?.data : error });
                //console.log(data);
                console.log(error);
            }
        };

        fetchData();
    }, [query]);

    return data;
}

/**Get Key*/
export function useFetchKey(query){
    const [data, setData] = useState({ isLoading: true, apiData: null, status: null, serverError: null})

    useEffect(() => {
        const fetchData =  async () => {
            try {        
                
                const { data, status} = !query ? await axios.get(`/api/apikey/getKey/${query}`, { withCredentials: true }) : await axios.get(`/api/apikey/getKey/${query}`, { withCredentials: true })
                //console.log('Data from Hooks>>>', data)

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

/**Get all public story */
export function publicStoryBook(query) {
    const [data, setData] = useState({ isLoadingStory: true, apiPublicStoryData: null, storyStatus: null, storyServerError: null });
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const id = user?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (!query) {
                    // If there is no query, fetch all stories for the user
                    url = `/api/user/story/public`;
                } else {
                    // If there is a query, fetch a specific story
                    const { userId, storyId } = query;
                    url = `/api/user/story/${userId}/${storyId}`;
                }

                //console.log('ID', id, 'QUERY', query);
                const { data, status } = await axios.get(url, { withCredentials: true });
                //console.log('Story Data from Hooks>>>', data);

                if (status === 200) {
                    setData({ isLoadingStory: false, apiPublicStoryData: data, storyStatus: status, storyServerError: null });
                } else {
                    setData({ isLoadingStory: false, apiPublicStoryData: null, storyStatus: status, storyServerError: null });
                }
            } catch (error) {
                setData({ isLoadingStory: false, apiPublicStoryData: null, storyStatus: error.response?.status, storyServerError: error.response?.data?.data ? error.response?.data?.data : error });
                //console.log(data);
                console.log(error);
            }
        };

        fetchData();
    }, [query]);

    return data;
}

/**Get All Subscriptions */
export function useFetchSubscriptionData(query) {
    const [data, setData] = useState({ isLoadingSubs: true, apiUserSubsData: null, subsStatus: null, subServerError: null });
    const { currentUser } = useSelector(state => state.user);
    const user = currentUser?.data;
    const id = user?._id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url;
                if (!query) {
                    // If there is no query, fetch all stories for the user
                    url = `/api/admin/getAllSubscriptions`;
                } else {
                    // If there is a query, fetch a specific story
                    const { userId, storyId } = query;
                    url = `/api/user/story/${userId}/${storyId}`;
                }

                //console.log('ID', id, 'QUERY', query);
                const { data, status } = await axios.get(url, { withCredentials: true });
                //console.log('Story Data from Hooks>>>', data);

                if (status === 200) {
                    setData({ isLoadingSubs: false, apiUserSubsData: data, subsStatus: status, subServerError: null });
                } else {
                    setData({ isLoadingSubs: false, apiUserSubsData: null, subsStatus: status, subServerError: null });
                }
            } catch (error) {
                setData({ isLoadingSubs: false, apiUserSubsData: null, subsStatus: error.response?.status, subServerError: error.response?.data?.data ? error.response?.data?.data : error });
                //console.log(data);
                console.log(error);
            }
        };

        fetchData();
    }, [query]);

    return data;
}

/**Get All Stories */
export function useFetchStories(query){
    const [data, setData] = useState({ isLoading: true, apiData: null, status: null, serverError: null})

    useEffect(() => {
        const fetchData =  async () => {
            try {

                const { data, status} = !query ? await axios.get(`/api/admin/getStories`, { withCredentials: true }) : await axios.get(`/api/admin/getStory/${query}`, { withCredentials: true })
                //console.log('Data from Hooks>>>', data)

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