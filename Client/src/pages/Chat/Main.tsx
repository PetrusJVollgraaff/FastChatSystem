import ChatCTN from './ChatCTN'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChatNav from '../Navs/ChatNav'
import { SocketProvider } from '../../contexts/SocketProvider'
import { ConcentionProvider } from '../../contexts/ConcentionProvider'


export interface Contact {
  id: number;
  name: string;
}

export interface ContactsTypeProps {
    selecteduser: string;
    contactlist: Contact[];
    setContactlist: () => void;
    setSelectedUser: ()=> void;
}

export type ContactsTypes = {
    selecteduser: string;
    contactlist: [];
    setContactlist: () => void;
    setSelectedUser: ()=> void;
}

export default function MainChat() {

    return (
        <ConcentionProvider>
        <SocketProvider>
            <BrowserRouter>
                <ChatNav />
                <Routes>
                    <Route path="/" element={<ChatCTN  />}/>
                </Routes>
            </BrowserRouter>
        </SocketProvider>
        </ConcentionProvider>
    )
}
