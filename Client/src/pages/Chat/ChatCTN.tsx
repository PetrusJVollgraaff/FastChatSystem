import { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../contexts/SocketProvider';
import { type ContactsTypeProps } from './Main';
import { checkEmpty } from '../../utils';
import { useAuth } from '../../contexts/AutherizedProvider';
import MessageBubble from '../message/messageBubble';

export default function ChatCTN({contacttype}:ContactsTypeProps) {
   const {token} = useAuth()
  const { sendMessage, getExistingMessages, messagelist } = useSocket()
  const inputMessageRef = useRef(null)
  const formMessageRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [messageDetail, setMessageDetail] = useState({  
    sendto: contacttype.selecteduser?.id,
    message: ""
  })

  useEffect(()=>{
    if (contacttype.selecteduser == messageDetail.sendto) return;
    getExistingMessages(contacttype.selecteduser, ()=>{
      setLoading(true)
    }, ()=>{
      setLoading(false)
    }) 
    console.log(messagelist)  
    
  },[contacttype.selecteduser])

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
    console.log("hello", messageDetail)
    if(contacttype.selecteduser?.id){
      setMessageDetail((prev) => ({
        ...prev,
        ['sendto']: contacttype.selecteduser?.id,
        }));
        sendMessage(messageDetail)
    }    
  }

  /*const getExistingMessages = ()=>{
        setLoading(true)
        if(!contacttype.selecteduser) return;
        const formData = new FormData()
        formData.append("token", token.access )
        formData.append("selecteduserid", contacttype.selecteduser?.id )

        fetch("http://localhost:5000/user/messages",{
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
                    setTimeout(()=>{
                        setMessagelist(response.messages)
                        setLoading(false)
                    },2000)
                    
                }
                
            }).catch((e)=>{
                console.error(e)
            })
  }*/
  
  return (
    <main className="chat_container">
        <div className="chat_header">{contacttype.selecteduser?.username}</div>
        <div className="chat_message_ctn" >
          <ul>
            {
                messagelist.map((message, idx)=>{
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
