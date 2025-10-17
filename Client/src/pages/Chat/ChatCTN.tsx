import React, { useRef, useState } from 'react'
import { useSocket } from '../../contexts/SocketProvider';
import  { type ContactsTypeProps } from './Main';

export default function ChatCTN({contacttype}:ContactsTypeProps) {
  const {sendMessage} = useSocket()
  const inputMessageRef = useRef(null)
  const [sendtoRef] = useState(contacttype.selecteduser)
  const [messageDetail, setMessageDetail] = useState({
    sendto: contacttype.selecteduser,
    message: ""
  })

  const onInputChange = (evt) => {
        const { name, value } = evt.target;
        setMessageDetail((prev) => ({
        ...prev,
        [name]: value,
        }));
        setMessageDetail((prev) => ({
        ...prev,
        ['sendto']: contacttype.selecteduser,
        }));
        validateInput(evt);
        
    };

  const validateInput = (evt) => {
        let { name, value } = evt.target;
        
        if (inputMessageRef){
            inputMessageRef.current.setCustomValidity( messageDetail.message === "" || checkEmpty(value)? "Please enter a message.": "")           
        }
    }
  
  const checkEmpty = (value) =>{
        const regex = /^\s*$/;
        return regex.test(value); 
    }

  const handleSubmit = (evt)=>{
    evt.preventDefault()
    console.log(messageDetail)
    sendMessage(messageDetail)
  }
  
  return (
    <main className="chat_container">
        <div className="chat_message_ctn">

        </div>
        <div className="chat_textbox_ctn">
            <form onSubmit={handleSubmit}>
              <textarea 
                name="message" 
                required
                value={messageDetail.message}
                onChange={onInputChange}
                ref={inputMessageRef}
              ></textarea>
              <button type="submit">Send</button>
            </form>            
        </div>
    </main>
  )
}
