import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

function AuthorizeUser () {
    const  {currentUser}  = useSelector(state => state.user)
    const cookieExists = (name) => {
      return document.cookie.split(';').some((cookie) => {
        return cookie.trim().startsWith(`${name}=`);
      });
    };

    const fonyAccessTokenExists = cookieExists('fonyAccessToken')
    
    if(fonyAccessTokenExists){
      return <Outlet />;
    } else {
      toast.error('PLEASE LOGIN')
      return <Navigate to={'/login'} />;
    }
}

function UserExist () {
  const  {currentUser}  = useSelector(state => state.user)
    return currentUser === null ? <Outlet /> : <Navigate to='/dashboard' />
}

function AdminUser (){
    const  {currentUser}  = useSelector(state => state.user)
    const adminUser = currentUser?.data.isAdmin
      return adminUser ? <Outlet /> : <Navigate to='/' />
}

export {AuthorizeUser, AdminUser, UserExist}