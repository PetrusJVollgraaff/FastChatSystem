import React, { useEffect, useRef, useState } from 'react'
import ChatCTN from './ChatCTN'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatNav from '../Navs/ChatNav'
import { SocketProvider, useSocket } from '../../contexts/SocketProvider'
import { useAuth } from '../../contexts/AutherizedProvider'


export interface Contact {
  id: number;
  name: string;
}

export interface ContactsTypeProps {
    selecteduser: string;
    contactlist: Contact[];
    setContactlist: () => void;
    setSelectedUser: ()=> void;
}

export type ContactsTypes = {
    selecteduser: string;
    contactlist: [];
    setContactlist: () => void;
    setSelectedUser: ()=> void;
}

export default function MainChat() {
    const {token} = useAuth()
    const hasFetched = useRef(false);
    const [listContacts, setListContacts] = useState([])
    const [selectedContact, setSelectContact] = useState(null)

    useEffect(()=>{
        if (hasFetched.current) return;
        getUsersContacts()


    },[])

    const getUsersContacts =()=>{
        hasFetched.current = true;
    
        const formData = new FormData()
        formData.append("token", token.access )
        
        fetch("http://localhost:5000/user/contacts",{
            method: 'POST',
            body: formData,
        })
        .then((response)=>{
            if (!response.ok) {
                const errorText = response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            return response.json();
        }).then((response)=>{
            if(response.status == "success"){
                ContactProps.setContactlist(response.contacts)
                //appendContacts(response.contacts)
                if(!ContactProps.selecteduser){
                    ContactProps.setSelectedUser(response.contacts[0])
                }
            }
            
        }).catch((e)=>{
            console.error(e)
        })
    }    
    
    const ContactProps : ContactsTypeProps = {
        selecteduser: selectedContact,
        contactlist: listContacts,
        setContactlist: function(newContacts){
            
            setListContacts((prev)=>{
                const existingIds = new Set(prev.map((c) => c.id));
                const filtered = newContacts.filter((c) => !existingIds.has(c.id));
                return [...filtered, ...prev];
            })

            console.log(this.contactlist, ContactProps)
            setTimeout(()=>{
                console.log(this.contactlist, ContactProps)
            },1000)
        },
        setSelectedUser: function(user){
            setSelectContact((prev)=>{
                console.log(prev, prev != user.id)
                if(prev != user.id){
                    return user.id;
                }

                return prev;
            })

            console.log(this.selecteduser)
        },
    }

    /**
     <Routes>
                    <Route path="/" element={<ChatCTN contacttype={ContactProps} />}/>
                </Routes>
     */

    return (
        <SocketProvider>
            <BrowserRouter>
                <ChatNav contacttype={ContactProps}/>
                <ChatCTN contacttype={ContactProps}/>
                
            </BrowserRouter>
        </SocketProvider>
    )
}
