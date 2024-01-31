import {createPortal} from "react-dom";
import React, {useCallback, useContext, useEffect, useRef} from "react";
const modalRootElement: any = document.querySelector('#portal')
import './profileModal.scss'
import AvatarView from "../../common/avatarView/AvatarView.tsx";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";
interface Props {
    handleClose: () => void;
    isOpen:boolean;
}
const ProfileModal: React.FC<Props> = ({ isOpen,handleClose }) => {
    const {profile} = useContext(StreamsContext)
    const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
    const checkKeyEscape = useCallback((event:KeyboardEvent)=> {
        if(event.key ==="Escape") handleClose();
    },[handleClose])
    const checkOutside = (event: any) => {
        if (event.target?.contains(ref.current) && event.target !== ref.current) handleClose()
    };
    useEffect(() => {
        document.body.addEventListener("keydown", checkKeyEscape);
        document.addEventListener('mousedown', checkOutside);
        if(!isOpen){
            document.body.removeEventListener("keydown", checkKeyEscape);
            document.removeEventListener('mousedown', checkOutside);
        }
        return () => {
            document.body.removeEventListener("keydown", checkKeyEscape);
            document.removeEventListener('mousedown', checkOutside);
        };
    }, [handleClose, checkKeyEscape, checkOutside]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" >
            <div className="modal" ref={ref}>
                <div className={"header-modal"}>
                    Настройки
                    <div>И что-то <button onClick={handleClose}>X</button></div>
                </div>
                <div className={"profile-info"}>
                    <AvatarView online={false} size={75}/>
                    <div className={"profile-data"}>
                        <div>{profile.Login}</div>
                        <div>{profile.Email}</div>
                    </div>
                </div>

            </div>
        </div>
        , modalRootElement);
}

export default ProfileModal;