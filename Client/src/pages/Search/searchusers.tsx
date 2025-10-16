import React, { useEffect, useRef, useState } from 'react'

export default function SearchUsers({closeModal}) {
    const [searchText, setSearchText] = useState(null)
    const [listUsers, setListUsers] = useState([])
    const [visible, setVisible] = useState(10)
    const [loading, setLoading] = useState(false)
    const listRef = useRef(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout |null>(null)
    
    useEffect(()=>{
        
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
        setSearchText(value)
                
        if(searchTimeoutRef.current){
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(()=>{
            console.log("hello")
        },1000)
    }

  return (
    <div className='User_Search_main'>
        <div className='search_ctn'>
            <input type="search" name="" id="" onChange={SearchUsers}/>
        </div>
        <div className='list_ctn' ref={listRef}>
            {
                listUsers.slice(0, visible).map((user)=>(
                    <div>
                        {user.username}
                    </div>
                ))
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
