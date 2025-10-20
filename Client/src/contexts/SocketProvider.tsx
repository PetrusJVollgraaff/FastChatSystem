import React, {useContext, useEffect, useRef, useState} from "react";
import io from 'socket.io-client'
import { useAuth } from "./AutherizedProvider";

const SocketContext = React.createContext()

export function useSocket(){
    return useContext(SocketContext)
}

export function SocketProvider({children}){
    const { user, token } = useAuth();
    const [messages, setMessages] = useState([])
    const [connected, setConnected] = useState(false)
    const [messagelist, setMessagelist] = useState([])
    const wsRef = useRef(null)

    useEffect(()=>{
        if(!token) return;
        
        const ws = new WebSocket(`ws://localhost:5000/ws/${user.id}`)
        wsRef.current = ws;
        ws.onopen = ()=>{
            setConnected(true)
            ws.send(JSON.stringify({type: "join", token: token.access}))
            console.log("Connected to WebSocket")
        }


        ws.onmessage = (evt)=>{
            try{
                const data = JSON.parse(evt.data);
                
                if(data?.message){
                    setMessagelist((prev)=>{
                        return [...prev, ...[data.message]]
                    })
                }
            }catch(e){
                console.error("Invalid WS message", e)
            }
        }

        ws.onclose = ()=>{
            console.warn(" WebSocket closed")
            setConnected(false)
        }


        return () => ws.close()
    },[user, token])


    function sendMessage(content){
        console.log(content)
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({type: "message", content, token}))
        }
    }

    function getExistingMessages(selecteduser, callback1, callback2){
        //setLoading(true)
        callback1()
        if(!selecteduser) return;
        const formData = new FormData()
        formData.append("token", token.access )
        formData.append("selecteduserid", selecteduser?.id )

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
                    setMessagelist(response.messages)
                    callback2()                    
                }
                
            }).catch((e)=>{
                console.error(e)
            })
  }

    return(
        <SocketContext.Provider value={{connected, messages, sendMessage, getExistingMessages, messagelist}}>
            {children}
        </SocketContext.Provider>
    )
}