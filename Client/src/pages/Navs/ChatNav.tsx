import React from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import { useNavigate } from 'react-router-dom';

export default function ChatNav() {
    const { logoutUser} = useAuth()
    const navigate = useNavigate();

    const logout = (evt) => {
        logoutUser((data)=>{
            if(data.success){
                navigate("/")
            }
        })
    }

  return (
    <nav className="contact_nav">
        <button onClick={logout} className="logout_btn">Logout</button>
    </nav>
  )
}
