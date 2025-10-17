import React, { useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import { useNavigate } from 'react-router-dom';
import Modal, { type ModalTypeProps } from '../Modal/modal';
import SearchUsers from '../Search/searchusers';
import Contacts from '../Contacts/Contacts';
import {type ContactsTypeProps } from '../Chat/Main';

export default function ChatNav({contacttype}:ContactsTypeProps) {
    const { logoutUser} = useAuth()
    const [listContacts, setListContacts] = useState([])
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
        content: <SearchUsers closeModal={closeModal} contactsprops={contacttype}/>
    }

    return (
        <nav className="contact_nav">
            <button onClick={logout} className="logout_btn">Logout</button>
            <div>
                <input type="search" name="search_contact" id="search_contact" placeholder='Search Contact' />
            </div>
            <div>
                <button onClick={openModal}>Start Message</button>
            </div>
            <div >
                <Contacts contacttype={contacttype}/>

            </div>
            <Modal modalObj={ModalProps} >
                <h1>Hello</h1>
            </Modal>
        </nav>
    )
}
