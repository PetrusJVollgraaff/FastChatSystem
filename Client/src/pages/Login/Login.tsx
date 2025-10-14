import React, { useEffect, useRef, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AutherizedProvider'

export default function LoginPage() {
    const navigate = useNavigate();

    const { loginUser, user, token } = useAuth()
    const inputPasswordRef = useRef(null)
    const inputUsernameRef = useRef(null)
    const [input, setInput] = useState({
        username: "",
        password: ""
    })

    const onInputChange = (evt) => {
        const { name, value } = evt.target;
        setInput((prev) => ({
        ...prev,
        [name]: value,
        }));
        validateInput(evt);
    };

    const validateInput = (evt) => {
        let { name, value } = evt.target;
        
        if (inputUsernameRef){
            inputUsernameRef.current.setCustomValidity( input.username === "" || checkEmpty(value)? "Please enter a valid username.": "")           
        }
        
        if ( inputPasswordRef){
            inputPasswordRef.current.setCustomValidity( input.password === "" || checkEmpty(input.password)? "Please enter a password.": "")
        }
    }

    const checkEmpty = (value) =>{
        const regex = /^\s*$/;
        return regex.test(value); 
    }

    const handleSubmit = (evt)=>{
        evt.preventDefault()
        loginUser(input, evt, (data)=>{
            if(data.status == "success"){
                //navigate("/main")
            }
        })
    }
  
    return (
    <div className='login_ctn'>
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Login</legend>
                <div>
                    <label>
                        <span>Username :</span>
                        <input 
                            type="text" 
                            required  
                            name="username" 
                            value={input.username}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            ref={inputUsernameRef}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <span>Password :</span>
                        <input type="password" 
                            required 
                            name="password" 
                            value={input.password}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            ref={inputPasswordRef}
                        />
                    </label>
                </div>
            </fieldset>
            <div className='btn_ctn'>
                <Link to="/register">Register</Link>
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
  )
}
