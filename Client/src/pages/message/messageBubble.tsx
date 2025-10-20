import React from 'react'

export default function MessageBubble({data}) {
  return (
    <li data-dir={data.type}>
        
        <div>
            <div>
                <p>{data.type == "1" ? "You": data.sender_username}</p>
                <p>{data.create_at}</p>
            </div>
            <div className="content">
                <p>{data.message}</p>
            </div>
            
        </div>
    </li>
  )
}
