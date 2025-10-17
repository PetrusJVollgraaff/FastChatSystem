import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';


export interface ContactsTypeProps {
    contactlist: [];
    setContactlist: () => void;
}

export default function Contacts({contacttype}:ContactsTypeProps) {
    const {token} = useAuth()
    const hasFetched = useRef(false);

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
                contacttype.setContactlist(response.contacts)
            }
            
        }).catch((e)=>{
            console.error(e)
        })
    }


  return (
    <div>
        {
            contacttype.contactlist.map((user, idx)=>(
                <div key={idx}>
                    {user.username}
                </div>
            ))
        }
    </div>
  )
}
