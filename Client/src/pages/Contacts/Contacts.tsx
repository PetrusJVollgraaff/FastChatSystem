import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import  { type ContactsTypeProps } from '../Chat/Main';
import { useConnection } from '../../contexts/ConcentionProvider';
import { useSocket } from '../../contexts/SocketProvider';

export default function Contacts({contacttype}:ContactsTypeProps) {
  const { ContactProps } = useConnection()
  const { setMessagelist } = useSocket()

  const SelectUser =(user)=>{
    ContactProps.setSelectedUser(user)
    setMessagelist( ContactProps.getMessages() )
  }


  return (
    <div>
        {
            ContactProps.contactlist.map((user, idx)=>(
                <div key={idx} onClick={()=>{SelectUser(user)}}>
                    {user.username}
                </div>
            ))
        }
    </div>
  )
}
