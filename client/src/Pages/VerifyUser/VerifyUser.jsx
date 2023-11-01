import { useNavigate, useParams } from 'react-router-dom'
import './VerifyUser.css'
import { useEffect } from 'react';
import { verifyUser } from '../../helpers/api';
import Logo from '../../Components/Logo/Logo';

function VerifyUser() {
    const navigate = useNavigate()
    const { id, token } = useParams();
    
    useEffect(() => {
        console.log('ID', id, 'TOKEN', token)
        const verify = async () => {
            try {
                const res = await verifyUser({ id, token})

                if(res.data.success){
                    navigate('/login')
                }
            } catch (error) {
                
            }    
        }

        verify();
    }, [id, token])
  return (
    <div className='verifyUser'>
        <div className="content">
            <Logo />

            <p>Verifying User</p>
        </div>
    </div>
  )
}

export default VerifyUser