import {createPortal} from "react-dom";
import React, {useCallback, useContext, useEffect, useRef, useState} from "react";
import './profileModal.scss'
import AvatarView from "../avatarView/AvatarView.tsx";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";
import Icon, {AppIcons} from "../icon/Icon.tsx";
import {ClientActionsApi} from "../../../data/api.ts";
import {useAuth} from "../../../hooks/useAuth.tsx";

const modalRootElement: any = document.querySelector('#portal')

interface Props {
    handleClose: () => void;
    isOpen: boolean;
}

const ProfileModal: React.FC<Props> = ({isOpen, handleClose}) => {
    const {profile} = useContext(StreamsContext)
    const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        login: profile.Login,
        email: profile.Email,
    });
    const {logout} = useAuth()
    const checkKeyEscape = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            handleClose()
            setIsEditMode(false)
        }
    }, [handleClose])
    const checkOutside = (event: MouseEvent) => {
        if (event.target?.contains(ref.current) && event.target !== ref.current) {
            handleClose()
            setIsEditMode(false)
        }
    };
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
    }, [handleClose, checkKeyEscape, checkOutside]);
    const handleEditClick = () => {
        setEditedProfile({
            login: profile.Login,
            email: profile.Email,
        });
        setIsEditMode(true);
    };
    const handleConfirmClick = async () => {
        await new ClientActionsApi().UpdateData(
            {
                Avatar: new Uint8Array,
                Email: editedProfile.email,
                Login: editedProfile.login,
                Online: true,
                UserId: profile.UserId,
                lastSeenMillis: 0
            }
            , logout
        )
        setIsEditMode(false);
    };
    const handleCancelClick = () => {
        setEditedProfile({
            login: profile.Login,
            email: profile.Email,
        });
        setIsEditMode(false);
    };
    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay">
            <div className="modal" ref={ref}>
                <div className={"header-modal"}>
                    Настройки
                    <div className={"buttons-modal"}>
                        {isEditMode ? (
                            <>
                                <Icon icon={AppIcons.checkmark} size={15} onClick={handleConfirmClick}/>
                                <Icon icon={AppIcons.xSymbol} onClick={handleCancelClick} size={15}/>
                            </>
                        ) : (
                            <>
                                <Icon icon={AppIcons.pencil} size={15} onClick={handleEditClick}/>
                                <Icon icon={AppIcons.xSymbol} onClick={handleClose} size={15}/>
                            </>
                        )}
                    </div>
                </div>
                <div className={"profile-info"}>
                    <AvatarView online={false} size={75}/>
                    <div className={"profile-data"}>
                        {isEditMode ? (
                            <>
                                <input
                                    style={{padding: '.2rem .5rem'}}
                                    className={"edit-input-wrapper"}
                                    type="text"
                                    value={editedProfile.login}
                                    onChange={(e) => setEditedProfile({...editedProfile, login: e.target.value})}
                                />
                                <input
                                    style={{padding: '.2rem .5rem'}}
                                    className={"edit-input-wrapper"}
                                    type="text"
                                    value={editedProfile.email}
                                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                                />
                            </>
                        ) : (
                            <>
                                <div style={{padding: '.2rem .5rem'}}>{profile.Login}</div>
                                <div style={{padding: '.2rem .5rem'}}>{profile.Email}</div>
                            </>
                        )}
                    </div>
                </div>

            </div>
        </div>
        , modalRootElement);
}

export default ProfileModal;