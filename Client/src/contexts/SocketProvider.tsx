import React, {useContext, useEffect, useRef, useState} from "react";
import io from 'socket.io-client'
import { useAuth } from "./AutherizedProvider";

const SocketContext = React.createContext()

export function useSocket({children}){
    return useContext(SocketContext)
}

export function SocketProvider({children}){
    const { user } = useAuth();
    const [messages, setMessages] = useState([])
    const [connected, setConnected] = useState(false)
    const wsRef = useRef(null)

    useEffect(()=>{
        if(!user) return;

        const ws = new WebSocket("ws://localhost:5000/ws")
        wsRef.current = ws;
        ws.onopen = ()=>{
            setConnected(true)
            ws.send(JSON.stringify({type: "join", username: user.username}))
            console.log("Connected to WebSocket")
        }


        ws.onmessage = (evt)=>{
            try{

            }catch(e){
                console.error("Invalid WS message", e)
            }
        }

        ws.onclose = ()=>{
            console.warn(" WebSocket closed")
            setConnected(false)
        }


        return ()=> ws.close()
    },[user])


    function sendMessage(content){
        if(!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        wsRef.current.send(JSON.stringify({type: "message", content}))
    }

    return(
        <SocketContext.Provider value={{connected, messages, sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}