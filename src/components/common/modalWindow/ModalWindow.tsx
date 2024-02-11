import {createPortal} from "react-dom";
import React, {FC, ReactNode, useCallback, useEffect, useRef, useState} from "react";
import './modalWindow.scss'
import Icon, {AppIcons} from "../icon/Icon.tsx";

const modalRootElement: any = document.querySelector('#portal')

interface Props {
    handleClose: () => void;
    isOpen: boolean;
    children: ReactNode;
    title: string;
    headerActions?: ReactNode
}

const ModalWindow: FC<Props> = ({isOpen, handleClose, children, title, headerActions}) => {
    const [isOut, setIsOut] = useState(false)
    const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
    const checkKeyEscape = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setIsOut(true)
            setTimeout(() => {
                handleClose()
            }, 350)
        }
    }, [handleClose])
    const checkOutside = useCallback((event: any) => {
        if (event.target?.contains(ref.current) && event.target !== ref.current) {
            setIsOut(true)
            setTimeout(() => {
                handleClose()
            }, 350)
        }
    }, [handleClose]);
    useEffect(() => {
        document.body.addEventListener("keydown", checkKeyEscape);
        document.addEventListener('mousedown', checkOutside);
        if (!isOpen) {
            document.body.removeEventListener("keydown", checkKeyEscape);
            document.removeEventListener('mousedown', checkOutside);
        }
        return () => {
            document.body.removeEventListener("keydown", checkKeyEscape);
            document.removeEventListener('mousedown', checkOutside);
        };
    }, [handleClose, checkKeyEscape, checkOutside, isOpen]);

    useEffect(() => {
        return () => {
            // setIsOut(false)
        }
    }, []);

    if (!isOpen) return null;

    return createPortal(
        <div className={`modal-overlay ${isOut ? "on-out-animation" : "on-enter-animation"}`}>
            <div className="modal" ref={ref}>
                <div className={"header-modal"}>
                    {title}
                    {headerActions ?? <Icon icon={AppIcons.xSymbol} onClick={handleClose} size={15}/>}
                </div>
                {children}
            </div>
        </div>
        , modalRootElement);
}

export default ModalWindow;