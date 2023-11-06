import { Navigate } from "react-router-dom";
import { useFetch } from "../hooks/fetch.hooks";

export const AuthorizeUser = ({ children }) => {
    const authToken = localStorage.getItem('authToken')
    const { apiData } = useFetch()
    if(!authToken && !apiData){
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    return children
}

export const AdminUser = ({ children }) => {
    const authToken = localStorage.getItem('authToken')
    const { apiData } = useFetch()
    const isAdmin = apiData?.isAdmin
    if(!authToken && !isAdmin){
        return <Navigate to={'/'} replace={true}></Navigate>
    }

    return children
}

export const ValidToken = ({ children }) => {
    const authToken = localStorage.getItem('authToken')

    if(authToken){
        const tokenData = JSON.parse(atob(authToken.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const tokenExpiration = tokenData.exp
        console.log('TOKEN DATA>>', tokenExpiration)
        
        if( currentTime > tokenExpiration ){
            console.log('TOKEN EXPIRED')
            return <Navigate to={'/login'} replace={true}></Navigate>
        }
    } else {
        return <Navigate to={'/login'} replace={true}></Navigate>   
    }

    return children
}