import React, { useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import { useNavigate } from 'react-router-dom';
import Modal, { type ModalTypeProps } from '../Modal/modal';
import SearchUsers from '../Search/searchusers';
import Contacts, { type ContactsTypeProps } from '../Contacts/Contacts';

export default function ChatNav() {
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

    const appendContacts = (newContacts)=>{
        setListContacts((prev)=>{
            const existingIds = new Set(prev.map((c) => c.id));
            const filtered = newContacts.filter((c) => !existingIds.has(c.id));
            return [...filtered, ...prev];
        })
    }

    const ContactProps : ContactsTypeProps = {
        setContactlist: appendContacts,
        contactlist: listContacts
    }

    const ModalProps : ModalTypeProps = {
        title: "hello wolrd",
        isOpen: isModalOpen,
        onClose: closeModal,
        content: <SearchUsers closeModal={closeModal} contactsprops={ContactProps}/>
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
                <Contacts contacttype={ContactProps}/>

            </div>
            <Modal modalObj={ModalProps} >
                <h1>Hello</h1>
            </Modal>
        </nav>
    )
}
