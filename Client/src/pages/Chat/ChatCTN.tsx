import React, { useRef, useState } from 'react'

export default function ChatCTN() {
  const inputMessageRef = useRef(null)
  const [messageDetail, setMessageDetail] = useState({
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
  }
  
  return (
    <div className="chat_container">
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
            </form>            
        </div>
    </div>
  )
}
