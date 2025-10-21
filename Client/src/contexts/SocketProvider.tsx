import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AutherizedProvider";
import { useConnection } from "./ConcentionProvider";

const SocketContext = React.createContext()

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const { user, token } = useAuth();
    const { ContactProps } = useConnection()

    const [connected, setConnected] = useState(false)
    const [messagelist, setMessagelist] = useState([])
    const wsRef = useRef(null)

    useEffect(() => {
        if (!token) return;

        const ws = new WebSocket(`ws://localhost:5000/ws/${user.id}`)
        wsRef.current = ws;
        ws.onopen = () => {
            setConnected(true)
            ws.send(JSON.stringify({ type: "join", token: token.access }))
            console.log("Connected to WebSocket")
        }

        ws.onmessage = (evt) => {
            try {
                //const { ContactProps } = useConnection()
                const data = JSON.parse(evt.data);
                //console.log(data)
                if (data?.message) {
                    getPrivateMessage(data)
                }
                
            } catch (e) {
                console.error("Invalid WS message", e)
            }
        }

        ws.onclose = () => {
            console.warn(" WebSocket closed")
            setConnected(false)
        }


        return () => ws.close()
    }, [user, token, ContactProps, messagelist])

    async function getPrivateMessage(data){

        await ContactProps.appendContactMessage(data)
        if( data.id == ContactProps.selecteduser.id){
            setMessagelist((prev)=>{
                const messages = ContactProps.getMessages()
                const existingIds = new Set(prev.map((c) => c.create_at));
                const filtered = messages.filter((c) => !existingIds.has(c.create_at));
                return [...prev,...filtered];
            })
        }else{
            alert("message received from "+ data.message.sender_username )
        }        
    }


    function sendMessage(content) {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "message", content, token }))
        }
    }

    function getExistingMessages(selecteduser, callback1, callback2) {
        callback1()
        if (!selecteduser) return;
        const formData = new FormData()
        formData.append("token", token.access)
        formData.append("selecteduserid", selecteduser?.id)

        fetch("http://localhost:5000/user/messages", {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    const errorText = response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                return response.json();
            }).then((response) => {
                if (response.status == "success") {
                    ContactProps.setContactMessage(response.messages)
                    setMessagelist( ContactProps.getMessages() )
                    callback2()
                }

            }).catch((e) => {
                console.error(e)
            })
    }

    return (
        <SocketContext.Provider value={{ connected, sendMessage, getExistingMessages, messagelist , setMessagelist}}>
            {children}
        </SocketContext.Provider>
    )
}