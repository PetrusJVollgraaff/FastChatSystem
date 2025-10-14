import React, { useEffect, useState } from 'react'

const PreFix = "fastChat-"

export default function userLocalStorage(key, initialValue) {
  
    const prefixKey = PreFix + key;
    const [value, setValue] =useState(()=>{
        const jsonValue = localStorage.getItem(prefixKey);
        if(jsonValue !== null) return JSON.parse(jsonValue);
        return (typeof initialValue === "function")? initialValue() : initialValue;
    })

    useEffect(()=>{
        localStorage.setItem(prefixKey, JSON.stringify(value))
    }, [prefixKey, value])
  
    return [value, setValue]
}
