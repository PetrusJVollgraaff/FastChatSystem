import React from 'react'
import { AutherizedProvider, useAuth} from './contexts/AutherizedProvider';

import Main from './pages/Chat/Main';

import './css/main.css'
import FrontPage from './pages/FrontPage';
//import { useNavigate } from 'react-router-dom';



function AutherizedPages(){
  const { user } = useAuth()
  //const navigate = useNavigate();
  
  if(user){
    document.querySelector('body')?.classList.add("chat")
    //navigate("/main")
  }else{
    document.querySelector('body')?.classList.remove("chat")
  }
   
   return (
    <>
      { user ?  <Main /> : <FrontPage /> }
    </>
  )
}

function App() {
  return (
    <AutherizedProvider>
      <AutherizedPages />
    </AutherizedProvider>
  )
}

export default App
