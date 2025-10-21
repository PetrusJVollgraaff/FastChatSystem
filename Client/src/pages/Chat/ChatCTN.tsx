import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../contexts/SocketProvider';
import { checkEmpty } from '../../utils';
import MessageBubble from '../message/messageBubble';
import { useConnection } from '../../contexts/ConcentionProvider';

export default function ChatCTN() {
  const { sendMessage, getExistingMessages, messagelist } = useSocket()
  const { ContactProps } = useConnection()
  const inputMessageRef = useRef(null)
  const formMessageRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [messageDetail, setMessageDetail] = useState({  
    sendto: ContactProps.selecteduser?.id,
    message: ""
  })

  useEffect(()=>{
    setMessageDetail((prev) => ({
        ...prev,
        ['sendto']: ContactProps.selecteduser?.id,
        }));
  },[ContactProps.selecteduser])

  useEffect(()=>{ 
    console.log(ContactProps.contactlist)
    if (ContactProps.selecteduser == messageDetail.sendto) return;
    
    
    getExistingMessages(ContactProps.selecteduser, ()=>{
      setLoading(true)
    }, ()=>{
      setLoading(false)
    })     
  },[ContactProps.selecteduser])

  /*useEffect(()=>{
          const handleScroll = ()=>{
              if(!listRef.current)return
              const {scrollTop, scrollHeight, clientHeight} = listRef.current;
              if(scrollTop + clientHeight >= scrollHeight - 10){
                  loadMore();
              }
          }
  
          const container = listRef.current;
          container.addEventListener("scroll", handleScroll)
          return ()=>container.removeEventListener("scroll", handleScroll)
          
      },[visible])*/

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
    if(ContactProps.selecteduser?.id){
      setMessageDetail((prev) => ({
        ...prev,
        ['sendto']: ContactProps.selecteduser?.id,
        }));
        sendMessage(messageDetail)
    }    
  }
  
  return (
    <main className="chat_container">
        <div className="chat_header">{ContactProps.selecteduser?.username}</div>
        <div className="chat_message_ctn" >
          <ul>
            { messagelist.map((message, idx)=>{
                    return(
                    <MessageBubble key={idx} data={message}/>
                )})
            }
            {loading && <p>Loading...</p>}
            </ul>
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
