import React, { useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import { useNavigate } from 'react-router-dom';
import Modal, { type ModalTypeProps } from '../Modal/modal';
import SearchUsers from '../Search/searchusers';

export default function ChatNav() {
    const { logoutUser} = useAuth()
    const [loading, setLoading] = useState(false)
    const [listUsers, setListUsers] = useState([])
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const logout = (evt) => {
        logoutUser((data)=>{
            if(data.success){
                navigate("/")
            }
        })
    }

    const openModal = () => {
        setIsModalOpen(true);
    }    
    ;
    const closeModal = () => setIsModalOpen(false);

    const ModalProps : ModalTypeProps = {
        title: "hello wolrd",
        isOpen: isModalOpen,
        onClose: closeModal,
        content: <SearchUsers closeModal={closeModal}/>
    }

    

  return (
    <nav className="contact_nav">
        <button onClick={logout} className="logout_btn">Logout</button>
        <div>
            <input type="search" name="search_contact" id="search_contact" placeholder='Search Contact' />
        </div>
        <div>
            <button onClick={openModal}>Start Message</button>
            <Modal modalObj={ModalProps}>
                <h1>Hello</h1>
            </Modal>
        </div>
    </nav>
  )
}
