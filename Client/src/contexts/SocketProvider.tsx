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
                console.log(data)
            }catch(e){
                console.error("Invalid WS message", e)
            }
        }

        ws.onclose = ()=>{
            console.warn(" WebSocket closed")
            setConnected(false)
        }


        return ()=> ws.close()
    },[user, token])


    function sendMessage(content){
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({type: "message", content, token}))
        }
    }

    return(
        <SocketContext.Provider value={{connected, messages, sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}