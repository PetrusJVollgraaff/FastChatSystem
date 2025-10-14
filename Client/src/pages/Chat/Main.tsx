import React from 'react'
import ChatCTN from './ChatCTN'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatNav from '../Navs/ChatNav'
import { SocketProvider } from '../../contexts/SocketProvider'


export default function MainChat() {

    return (
    <SocketProvider>
        <BrowserRouter>
            <ChatNav />
            <Routes>
                <Route path="/" element={<ChatCTN />}/>
            </Routes>
        </BrowserRouter>
    </SocketProvider>
  )
}
