import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';
import  { type ContactsTypeProps } from '../Chat/Main';

export default function Contacts({contacttype}:ContactsTypeProps) {
  return (
    <div>
        {
            contacttype.contactlist.map((user, idx)=>(
                <div key={idx} onClick={()=>{contacttype.setSelectedUser(user)}}>
                    {user.username}
                </div>
            ))
        }
    </div>
  )
}
