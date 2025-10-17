import React from 'react'
import { AutherizedProvider, useAuth} from './contexts/AutherizedProvider';
import Main from './pages/Chat/Main';
import './css/main.css'
import FrontPage from './pages/FrontPage';




function AutherizedPages(){
  const { user, token } = useAuth()
  
  if(user && token){
    document.querySelector('body')?.classList.add("chat")  
  }else{
    document.querySelector('body')?.classList.remove("chat")
  }
   
  
  return (
    <>
      { user && token ?  <Main /> : <FrontPage /> }
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
