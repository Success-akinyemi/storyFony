import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
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
  const fonyAccessToken = localStorage.getItem('authToken');
  const fonyAccessTokenExists = !!fonyAccessToken;
  const navigate = useNavigate()

  useEffect(() => {
    if (!fonyAccessTokenExists) {
      console.log('NO USER');
      toast.error('PLEASE LOGIN');
    } else {
      const decodedToken = jwtDecode(fonyAccessToken);

      // Check if the token is expired
      if (decodedToken.exp * 1000 < Date.now()) {
        //console.log('EXP', decodedToken.exp)
        toast.error('Session expiried, Please login');
        navigate('/login')
      }
    }
  }, [currentUser, fonyAccessTokenExists]); 

  return fonyAccessTokenExists ? <Outlet /> : <Navigate to={'/login'} />;
}


function AdminUser (){
    const  {currentUser}  = useSelector(state => state.user)
    const adminUser = currentUser?.data.isAdmin
      return adminUser ? <Outlet /> : <Navigate to='/' />
}

export {AuthorizeUser, AdminUser}