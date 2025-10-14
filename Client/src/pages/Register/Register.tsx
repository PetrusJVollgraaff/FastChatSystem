import React, { useRef, useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider'


export default function RegistePage() {
    const { registerUser } = useAuth()
    const inputConfirmRef = useRef(null)
    const inputPasswordRef = useRef(null)
    const inputUsernameRef = useRef(null)
    const [input, setInput] = useState({
        username: "",
        password: "",
        confirmpassword: ""
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

        if(inputConfirmRef){
            inputConfirmRef.current.setCustomValidity( input.confirmpassword === "" || checkEmpty(input.confirmpassword)? "Please enter a confirmpassword.": "")

            if(name === "password" && input.confirmpassword != ""){
                inputConfirmRef.current.setCustomValidity( value !== input.confirmpassword ? "Password does not match": "")
            }

            if(name === "confirmpassword" && input.password != ""){
                inputConfirmRef.current.setCustomValidity( value !== input.password ? "Password does not match": "")
            }
        }
    }

    const checkEmpty = (value) =>{
        const regex = /^\s*$/;
        return regex.test(value); 
    }

    const handleSubmit = (evt)=>{
        evt.preventDefault()

        registerUser(input, evt, ()=>{

        })
    }

  return (
    <div className='register_ctn'>
        <form id="Register" onSubmit={handleSubmit} >
            <fieldset>
                <legend>Register</legend>
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
                        <input 
                            type="password" 
                            required 
                            name="password" 
                            value={input.password}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            ref={inputPasswordRef}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <span>Confirm Password: </span>
                        <input 
                            type="password" 
                            required 
                            name="confirmpassword" 
                            value={input.confirmpassword}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            ref={inputConfirmRef}
                        />
                    </label>
                </div>
            </fieldset>
            <div className='btn_ctn'>
                <button type="submit">Register</button>
            </div>
        </form>
    </div>
  )
}
