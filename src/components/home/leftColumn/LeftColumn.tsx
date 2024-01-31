import './leftColumn.scss'
import LeftMainHeader from "../leftMainHeader/LeftMainHeader.tsx";
import ChatList from "../chatList/ChatList.tsx";
import {useState} from "react";
import LeftMenu from "../leftMenu/LeftMenu.tsx";
const LeftColumn = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <div className={'left-column-wrapper'}>
            <LeftMainHeader action={() => setIsMenuOpen(!isMenuOpen)}/>
            <ChatList/>
            <LeftMenu state={isMenuOpen} action={() => setIsMenuOpen(false)}/>
        </div>
    )
}

export default LeftColumn