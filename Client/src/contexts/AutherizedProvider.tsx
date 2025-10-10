import React, {useContext, useEffect, useState } from 'react'


const AuthContext = React.createContext()

export function AutherizedProvider({children}) {
    const [user, setUser] = useState(null)
    
    useEffect(()=>{
        const saved = localStorage.getItem("chat.username")
        if(saved) setUser({username: saved})
    },[]);

    function loginUser({username, password}, callback=()=>{}){
        console.log("world", username)
        if(!username.trim()) return;
        localStorage.setItem("chat.username", username)
        setUser({username});
        callback({success: true})
    };

    function registerUser({username, password, confirmpassword}, callback=()=>{}){
        if(!username.trim()) return;
        localStorage.setItem("chat.username", username)
        setUser({username});

        callback({success: true})
    };

    function logoutUser(callback=()=>{}){
        localStorage.removeItem("chat.username")
        setUser(null)
        callback({success: true})
    };
  
    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}