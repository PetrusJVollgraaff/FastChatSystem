import React, { useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import { useNavigate } from 'react-router-dom';
import Modal, { type ModalTypeProps } from '../Modal/modal';
import SearchUsers from '../Search/searchusers';
import Contacts from '../Contacts/Contacts';
import ProfileSettings from '../ProfileSettings/ProfileSettings';
import { useConnection } from '../../contexts/ConcentionProvider';

export default function ChatNav() {
    const { logoutUser} = useAuth()
    const { ContactProps } = useConnection()
    const navigate = useNavigate();
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const logout = (evt) => {
        logoutUser((data)=>{
            if(data.success){
                navigate("/")
            }
        })
    }

    const openSearchModal = () => setIsSearchModalOpen(true);
    const closeSearchModal = () => setIsSearchModalOpen(false);
    
    const openSettingsModal = () => setIsSettingsModalOpen(true);   
    const closeSettingsModal = () => setIsSettingsModalOpen(false);

    const SearchModalProps : ModalTypeProps = {
        title: "hello wolrd",
        isOpen: isSearchModalOpen,
        onClose: closeSearchModal,
        content: <SearchUsers closeModal={closeSearchModal} contactsprops={ContactProps}/>
    }

    const SettingsModalProps : ModalTypeProps = {
        title: "Profile Settings",
        isOpen: isSettingsModalOpen,
        onClose: closeSettingsModal,
        content: <ProfileSettings closeModal={closeSettingsModal}/>
    }

    return (
        <nav className="contact_nav">
            <button onClick={logout} className="logout_btn">Logout</button>
            <button onClick={openSettingsModal} className="logout_btn">Settings</button>

            <div>
                <input type="search" name="search_contact" id="search_contact" placeholder='Search Contact' />
            </div>
            <div>
                <button onClick={openSearchModal}>Start Message</button>
            </div>
            <div >
                <Contacts />
            </div>
            <Modal modalObj={SearchModalProps} >
                <h1>Hello</h1>
            </Modal>
            <Modal modalObj={SettingsModalProps} >
                <h1>Hello</h1>
            </Modal>
        </nav>
    )
}
