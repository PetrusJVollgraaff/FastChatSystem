import React, {Children, useContext, useEffect, useRef, useState} from "react";
import io from 'socket.io-client'
import { useAuth } from "./AutherizedProvider";

const ConnectionContext = React.createContext()


export interface MessagesType {
    message: string;
    create_at: string;
    sender_username: string;
    receiver_username: string;
    type: string;
}

export interface Contact {
  id: number;
  name: string;
  messages: [];
}

export interface ContactsTypeProps {
    selecteduser: string;
    contactlist: Contact[];
    appendContactMessage: () => void;
    setContactMessage: () => void;
    getMessages: ()=> []
    setContactlist: () => void;
    setSelectedUser: ()=> void;
}


export function useConnection(){
    return useContext(ConnectionContext)
}

export function ConcentionProvider({children}) {
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
        
        fetch("http://localhost:5000/user/contacts2",{
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
        getMessages: function(){
            const idx = this.contactlist.findIndex((contact) => contact.id == this.selecteduser.id)
            if(idx > -1){     
                return this.contactlist[idx].messages
            }

            return []
        },
        appendContactMessage: function({message, id}){
            console.log(this)
            
            const idx = this.contactlist.findIndex((contact) => contact.id == id)
            console.log(idx, id, message)
            if(idx > -1){
                this.contactlist[idx].messages.push(message)
                console.log(this.contactlist[idx].messages)
            }
        },
        setContactMessage: function(messages){
            console.log(this.contactlist)
            const idx = this.contactlist.findIndex((contact) => contact.id == this.selecteduser.id)
            if(idx > -1){     
                this.contactlist[idx].messages = messages
            }
        },
        setContactlist: function(newContacts){
            console.log(newContacts)
            setListContacts((prev)=>{
                const existingIds = new Set(prev.map((c) => c.id));
                const filtered = newContacts.filter((c) => !existingIds.has(c.id));
                return [...filtered, ...prev];
            })
        },
        setSelectedUser: function(user){
            setSelectContact((prev)=>{
                if(prev != user){
                    return user;
                }

                return prev;
            })
        },
    }
  
    return (
        <ConnectionContext.Provider value={{ContactProps}}>
            {children}
        </ConnectionContext.Provider>
    )
}
