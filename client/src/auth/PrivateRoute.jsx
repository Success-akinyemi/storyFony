import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthorizeUser () {
    const  {currentUser}  = useSelector(state => state.user)
      return currentUser ? <Outlet /> : <Navigate to='/' />
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