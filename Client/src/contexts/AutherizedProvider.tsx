import React, {useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const AuthContext = React.createContext()

export function AutherizedProvider({children}) {
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    
    useEffect(()=>{
        const token_get = localStorage.getItem("token")
        console.log(token_get)
        
        if(token_get){
            const decoded = jwtDecode(token_get);
            setUser({username:decoded.sub, id: decoded.id});
            setToken({access: token_get})
        } 
    },[]);

    function loginUser({username, password}, evt, callback=()=>{}){
        if(!username.trim()) return;
    
        try{
            var formData = new FormData(evt.target)
            fetch("http://localhost:5000/auth/login",{
                method: 'POST',
                body: formData,
            }).then((response)=>{
                if (!response.ok) {
                    const errorText = response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                return response.json();
            }).then((response)=>{
                if(response.status == "success"){
                    localStorage.setItem("token", response.access_token)
                    setToken({access: response.access_token})
                    setUser({username});
                    callback({success: true})
                }     
            }).catch((e)=>{
                console.error(e)
            })
        }catch(e){
            console.error(e)
        }
    };

    function registerUser({username, password, confirmpassword}, evt, callback=()=>{}){
        if(!username.trim()) return;
        try{

            var formData = new FormData(evt.target)
            fetch("http://localhost:5000/auth/register",{
                method: 'POST',
                body: formData,
            }).then((response)=>{
                console.log(response)
                if (!response.ok) {
                    const errorText = response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                return response.json();
            }).then((response)=>{
                console.log(response)
                if(response.status == "success"){
                    localStorage.setItem("token", response.access_token)
                    setUser({username});
                    callback({success: true})
                }                
            }).catch((e)=>{
                console.error(e)
            })
        
        }catch(e){
            console.error(e)
        }
        
    };

    function logoutUser(callback=()=>{}){
        localStorage.removeItem("token")
        setUser(null)
        setToken(null)
        callback({success: true})
    };
  
    return (
        <AuthContext.Provider value={{ user, token, loginUser, registerUser, logoutUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext)
}