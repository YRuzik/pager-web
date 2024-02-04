import "./leftMenu.scss";
import React, { useContext, useEffect, useRef, useState } from "react";
import { StreamsContext } from "../../contexts/StreamsContext.tsx";
import AvatarView from "../../common/avatarView/AvatarView.tsx";
import ProfileModal from "../../common/profileModal/ProfileModal.tsx";
import ListTile from "../../common/listTile/ListTile.tsx";
import { useAuth } from "../../../hooks/useAuth.tsx";
import { createPortal } from "react-dom";

const modalBurgerElement: any = document.querySelector('#burger-portal');

interface LeftMenuProps {
    action: () => void;
    state: boolean;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ action, state }) => {
    const { logout } = useAuth();
    const node = useRef<HTMLDivElement>(null);
    const { profile } = useContext(StreamsContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (state) {
            setIsVisible(true);
        } else {
            const timeoutId = setTimeout(() => {
                setIsVisible(false);
            }, 300);
            return () => clearTimeout(timeoutId);
        }
    }, [state]);

    const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent) => void) => {
        useEffect(() => {
            const listener = (event: MouseEvent) => {
                if (!ref.current || ref.current.contains(event.target as Node)) {
                    return;
                }
                handler(event);
            };
            if (!isOpen) {
                document.addEventListener('mousedown', listener);
            }
            return () => {
                document.removeEventListener('mousedown', listener);
            };
        }, [ref, handler, isOpen, state]);
    };

    useOnClickOutside(node, () => action());

    return createPortal(

            <div className={`burger-overlay ${state ? "burger-overlay-active" : "burger-overlay-disable"}`}>
                <div ref={node} className={`menu ${state ? "Menu-open" : "Menu-close"}`}>
                    {isVisible ? (
                   <div>
                       <div className={"menu-info"}>
                           {profile.Avatar}
                           <AvatarView online={false} />
                           {profile.Login}
                       </div>
                       <div className={"button-list"}>
                           <ListTile onClick={() => setIsOpen(true)} isSelected={false}>
                               Настройки
                           </ListTile>
                           <ListTile onClick={() => logout()} isSelected={false}>
                               Выйти
                           </ListTile>
                       </div>
                   </div>
                ) : null}
                </div>
                <ProfileModal handleClose={() => setIsOpen(false)} isOpen={isOpen} />
            </div>,
        modalBurgerElement
    );
};

export default LeftMenu;
