import {createPortal} from "react-dom";
import React, {useEffect, useRef} from "react";
import "./modal.scss"
import AuthForm from "./authForm.tsx";
import RegForm from "./regForm.tsx";
const modalRootElement: any = document.querySelector('#portal')

const Modal = (props: any) => {
    const {open, onClose,LoginRegisterFrom} = props;
    const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        const checkOutside = (e: any) => {
            if (e.target?.contains(ref.current) && e.target !== ref.current) {
                onClose && onClose();
            }
        }
        document.addEventListener('click', checkOutside);
        document.addEventListener('scroll', checkOutside);
        return () => {
            document.removeEventListener('click', checkOutside)
            document.removeEventListener('scroll', checkOutside)
        }
    }, [onClose]);
    return createPortal(
        <>
            {open ? (
                <div className={'container'}>
                    <div className={'container-item'} ref={ref}>
                        {LoginRegisterFrom === "login" &&
                            <AuthForm onClose={onClose}/>}
                        {LoginRegisterFrom === "register" &&
                            <RegForm onClose={onClose}/>}
                    </div>

                </div>) : null}
        </>
        , modalRootElement);
}

export default Modal;
