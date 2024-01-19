import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Cookies from 'universal-cookie';

const cookies = new Cookies()

/**
 *
function AuthorizeUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [fonyAccessTokenExists, setFonyAccessTokenExists] = useState(false);

  const checkAccessToken = () => {
    const accessTokenExists = cookies.get('fonyAccessToken') !== undefined;
    console.log('ACCESS TOKEN', accessTokenExists)
    setFonyAccessTokenExists(accessTokenExists);

    if (!accessTokenExists) {
      console.log('NO USER');
      toast.error('PLEASE LOGIN');
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []); // Run only once after mount

  return fonyAccessTokenExists ? <Outlet /> : <Navigate to={'/login'} />;
}
 * 
*/

function AuthorizeUser() {
  const { currentUser } = useSelector((state) => state.user);
  const fonyAccessTokenExists = document.cookie.split(';').some((cookie) => cookie.trim().startsWith('fonyAccessToken='));

  useEffect(() => {
    if (!fonyAccessTokenExists) {
      console.log('NO USER');
      toast.error('PLEASE LOGIN');
    }
  }, [currentUser, fonyAccessTokenExists]); // Include currentUser and fonyAccessTokenExists in the dependencies array

  return fonyAccessTokenExists ? <Outlet /> : <Navigate to={'/login'} />;
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