import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AutherizedProvider'

export default function SearchUsers({closeModal, contactsprops}) {
    const {token} = useAuth()
    const [searchText, setSearchText] = useState(null)
    const [listUsers, setListUsers] = useState([])
    const [visible, setVisible] = useState(10)
    const [loading, setLoading] = useState(false)
    const listRef = useRef(null)
    const hasFetched = useRef(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout |null>(null)
      
    useEffect(()=>{
        if (hasFetched.current) return;
        getSearchUsers()
    },[])

    useEffect(()=>{
        const handleScroll = ()=>{
            if(!listRef.current)return
            const {scrollTop, scrollHeight, clientHeight} = listRef.current;
            if(scrollTop + clientHeight >= scrollHeight - 10){
                loadMore();
            }
        }

        const container = listRef.current;
        container.addEventListener("scroll", handleScroll)
        return ()=>container.removeEventListener("scroll", handleScroll)
        
    },[visible])

    const loadMore = ()=>{
        if(loading) return;
        setVisible((prev)=> Math.min(prev + 10, listUsers.length))
    }

    const SearchUsers = (evt) =>{
        const value = evt.target.value;
        
        if(searchTimeoutRef.current){
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(()=>{
            setSearchText(value)
        },1000)
    }

    const getSearchUsers =()=>{
        hasFetched.current = true;
        setLoading(true)
        const formData = new FormData()
        formData.append("token", token.access )

        fetch("http://localhost:5000/search/",{ method: 'POST', body: formData})
            .then((response)=>{
                if (!response.ok) {
                    const errorText = response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
                }

                return response.json();
            }).then((response)=>{
                if(response.status == "success"){
                    setListUsers(response.search)
                    setLoading(false)
                }
                
            }).catch((e)=>{
                console.error(e)
            })
    }

    const addToContact = (idx)=>{
        const user = listUsers[idx]

        if(user){
            const formData = new FormData()
            formData.append("token", token.access )
            formData.append("username", user.username )
            formData.append("userid", user.id )
            fetch("http://localhost:5000/user/addcontact",{
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
                if(response.status =="success"){
                    var idx = contactsprops.contactlist.findIndex((contact)=> contact.username == user.username && contact.id ==user.id)

                    if (idx == -1){
                        contactsprops.setContactlist([{username: user.username, id: user.id}])
                    }
                }
            }).catch((e)=>{
                console.error(e)
            })
        }
    }

  return (
    <div className='User_Search_main'>
        <div className='search_ctn'>
            <input type="search" name="" id="" onChange={SearchUsers}/>
        </div>
        <div className='list_ctn' ref={listRef}>
            {
                listUsers.slice(0, visible).map((user, idx)=>{
                    if(!!!searchText || user.username.toLowerCase().includes(searchText.toLowerCase())){

                    const inContacts =  contactsprops.contactlist.some((contact) => contact.id == user.id)
                    return(
                    <div key={idx}>
                        <span>{user.username}</span>
                        { (inContacts)? <span>In Contacts</span> :  <button type="button" onClick={()=>addToContact(idx)}> Add Contact</button> }
                    </div>
                )}})
            }
            {loading && <p>Loading...</p>}
            {visible >= listUsers.length && <p>No More items</p>}
        </div>
        <div className="btn_ctn">
            <button onClick={closeModal}>Close</button>    
        </div>
        
    </div>
  )
}
