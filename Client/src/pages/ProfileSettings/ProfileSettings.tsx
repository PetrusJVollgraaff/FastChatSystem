import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider';

export default function ProfileSettings({closeModal}) {
    const {token} = useAuth()
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const hasFetched = useRef(false);
     const [profile, setProfile] = useState({
            username: "",
            aboutme: ""
        })

    
    
    useEffect(()=>{
          if (hasFetched.current) return;
          getUsersSettings()
    },[])


    const onInputChange = (evt) => {
        const { name, value } = evt.target;
        setProfile((prev) => ({
        ...prev,
        [name]: value,
        }));
        validateInput(evt);
    };
    
    const validateInput = (evt) => {
        let { name, value } = evt.target;
    }

    const getUsersSettings =()=>{
        hasFetched.current = true;
        setLoading(true)
        const formData = new FormData()
        formData.append("token", token.access )

        fetch("http://localhost:5000/user/settings",{
            method: 'POST',
            body: formData,
        })
        .then((response)=>{
                if (!response.ok) {
                    const errorText = response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                return response.json();
            }).then((response)=>{
                if(response.status == "success"){
                    setTimeout(()=>{
                        setProfile(response.profile)
                        setLoading(false)
                    },2000)
                    
                }
                
            }).catch((e)=>{
                console.error(e)
            })
    }

    const handleSubmit = (evt)=>{
        evt.preventDefault()
        if(!loading && !isSubmitting){
            setIsSubmitting(true)
        const formData = new FormData()
        formData.append("token", token.access )
        formData.append("settings", JSON.stringify(profile) )

        fetch("http://localhost:5000/user/settings",{
            method: 'PUT',
            body: formData,
        })
        .then((response)=>{
                if (!response.ok) {
                    const errorText = response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                return response.json();
            }).then((response)=>{
                if(response.status == "success"){
                    setTimeout(()=>{
                        //setProfile(response.profile)
                        setIsSubmitting(false)
                    },2000)
                    
                }
                
            }).catch((e)=>{
                console.error(e)
            })
        }
        
    }

  
    return (
        <div>
            <form id="profile_model" onSubmit={handleSubmit}>
                <div>
                    <label>
                        <span>about me :</span>
                        <textarea  
                            name="aboutme" 
                            value={profile.aboutme}
                            onChange={onInputChange}
                            onBlur={validateInput}
                        ></textarea>
                    </label>
                </div>
            </form>
            {loading && <p>Loading...</p>}
            {isSubmitting && <p>Submitting...</p>}
            <div className="btn_ctn">
                <button type="submit" form="profile_model" disabled={(loading || isSubmitting) && 'disabled'}>Submit</button>    
                <button type="button" onClick={closeModal}>Close</button>    
            </div>
        </div>
    )
}
