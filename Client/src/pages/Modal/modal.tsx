import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'


export interface ModalTypeProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    content: React.ReactNode;
}

export default function Modal({ modalObj }:ModalTypeProps){

    const dialogRef = useRef(null)

    useEffect(()=>{
        if(dialogRef.current){
            var action = (modalObj.isOpen)? "showModal" : "close"
            dialogRef.current[action]()
        }
    }, [modalObj.isOpen])

    if (!modalObj.isOpen) return null;

    return createPortal(
        <dialog className='popup_modal' ref={dialogRef} onCancel={modalObj.onClose}>
            <div className='popup_modal_header'>
                {modalObj.title}
            </div>
            <div className='popup_modal_body'>
                {modalObj.content}
            </div>
        </dialog>,
        document.body
    );
};