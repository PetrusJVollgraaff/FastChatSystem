import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../contexts/SocketProvider';
import { type ContactsTypeProps } from './Main';
import { checkEmpty } from '../../utils';

export default function ChatCTN({contacttype}:ContactsTypeProps) {
  const { sendMessage } = useSocket()
  const inputMessageRef = useRef(null)
  const formMessageRef = useRef(null)
  const [messageDetail, setMessageDetail] = useState({
    sendto: contacttype.selecteduser?.id,
    message: ""
  })

  const onInputChange = (evt) => {
        const { name, value } = evt.target;
        setMessageDetail((prev) => ({
        ...prev,
        [name]: value,
        }));
        
        validateInput(evt);
    };

  const validateInput = (evt) => {
        let { value } = evt.target;
        
        if (inputMessageRef){
          inputMessageRef?.current.setCustomValidity( messageDetail.message === "" || checkEmpty(value)? "Please enter a message.": "")           
        }
    }
  
  const handleSubmit = (evt)=>{
    evt.preventDefault()
    console.log("hello", messageDetail)
    if(contacttype.selecteduser?.id){
      setMessageDetail((prev) => ({
        ...prev,
        ['sendto']: contacttype.selecteduser?.id,
        }));
        sendMessage(messageDetail)
    }    
  }
  
  return (
    <main className="chat_container">
        <div className="chat_header">{contacttype.selecteduser?.username}</div>
        <div className="chat_message_ctn">

        </div>
        <div className="chat_textbox_ctn">
            <form onSubmit={handleSubmit} ref={formMessageRef}>
              
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
