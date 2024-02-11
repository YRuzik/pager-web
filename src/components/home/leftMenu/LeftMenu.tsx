import "./leftMenu.scss"
import React, {FC, useContext, useEffect, useRef, useState} from "react";
import {StreamsContext} from "../../contexts/StreamsContext.tsx";
import AvatarView from "../../common/avatarView/AvatarView.tsx";
import ProfileModal from "../../common/profileModal/ProfileModal.tsx";
import ListTile from "../../common/listTile/ListTile.tsx";
import {useAuth} from "../../../hooks/useAuth.tsx";
import {createPortal} from "react-dom";
import {AppIcons, Icon} from "../../common/icon/Icon.tsx";
import CreateChatModal from "../../common/createChatModal/CreateChatModal.tsx";

interface LeftMenuProps {
    action: () => void;
    state: boolean;
}

const modalBurgerElement: any = document.querySelector('#burger-portal')
const LeftMenu: React.FC<LeftMenuProps> = ({action, state}) => {
    const {logout} = useAuth()
    const node = useRef<HTMLDivElement>(null);
    const {profile} = useContext(StreamsContext)
    const [modalsList, setModalsList] = useState<{ settings: boolean, createChat: boolean }>({
        settings: false,
        createChat: false
    })
    const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent) => void) => {
        useEffect(() => {
                const listener = (event: MouseEvent) => {
                    if (!ref.current || ref.current.contains(event.target as Node)) {
                        return;
                    }
                    handler(event);
                };
                if (!modalsList.settings && !modalsList.createChat) {
                    document.addEventListener('mousedown', listener);
                }
                if (!state) {
                    document.removeEventListener('mousedown', listener);
                }
                return () => {
                    document.removeEventListener('mousedown', listener);
                };
            },
            [ref, handler],
        );
    };
    useOnClickOutside(node, () => action());
    return createPortal(
        <div className={`burger-overlay ${state ? "burger-overlay-active" : "burger-overlay-disable"}`}>
            <div ref={node} className={`menu ${state ? "Menu-open" : "Menu-close"}`}>
                <div className={"menu-info"}>
                    {profile.Avatar}
                    <AvatarView online={false}/>
                    {profile.Login}
                </div>
                <div className={"button-list"}>
                    <MenuEntity onClick={() => setModalsList((prevState) => ({...prevState, createChat: true}))}
                                icon={AppIcons.groupAdd} label={"Новая группа"}/>
                    <MenuEntity onClick={() => setModalsList((prevState) => ({...prevState, settings: true}))}
                                icon={AppIcons.settings} label={"Настройки"}/>
                    <MenuEntity onClick={() => logout()} icon={AppIcons.logout} label={"Выйти"}/>
                </div>
            </div>
            <ProfileModal handleClose={() => setModalsList((prevState) => ({...prevState, settings: false}))}
                          isOpen={modalsList.settings}/>
            <CreateChatModal onClose={() => setModalsList((prevState) => ({...prevState, createChat: false}))}
                             isOpen={modalsList.createChat}/>
        </div>,
        modalBurgerElement
    )
}

type MenuEntityProps = {
    icon: AppIcons
    label: string
    onClick: () => void
}

const MenuEntity: FC<MenuEntityProps> = ({icon, label, onClick}) => {
    return <ListTile onClick={onClick} isSelected={false}>
        <div className={'menu-entity-wrapper'}>
            <Icon icon={icon} size={25} className={'gray-filter'}/>
            <div style={{paddingLeft: '0.5rem'}}>{label}</div>
        </div>
    </ListTile>
}

export default LeftMenu