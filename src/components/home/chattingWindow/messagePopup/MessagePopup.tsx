import Popup from "../../../common/popup/Popup.tsx";
import {FC} from "react";
import ListTile from "../../../common/listTile/ListTile.tsx";
import './messagePopup.scss'
type MessagePopupProps = {
    isOpen: boolean
    onClose: () => void
}

const MessagePopup: FC<MessagePopupProps> = ({isOpen, onClose}) => {
    return <Popup onClose={onClose} actions={
        <div>
            <ListTile onClick={() => {}} isSelected={false}>
                <div className={'message-popup-wrapper'}>
                     <div>Ответить</div>
                </div>
            </ListTile>
            <ListTile onClick={() => {}} isSelected={false}>
                <div className={'message-popup-wrapper'}>
                    <div>Редактировать</div>
                </div>
            </ListTile>
        </div>
    } isOpen={isOpen}>
    </Popup>
}

export default MessagePopup