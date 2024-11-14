import React from "react";
import style from "../styles/modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {

    if(!isOpen) return null;

    return (
        <div className={style.modaloverlay}>
            <div className={style.modalcontent}>
                <button className={style.closebutton} onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    )
}

export default Modal;