import './leftColumn.scss'
import LeftMainHeader from "../leftMainHeader/LeftMainHeader.tsx";
import ChatList from "../chatList/ChatList.tsx";
import LeftMenu from "../leftMenu/LeftMenu.tsx";
import { useState } from "react";
import UserList from "../userList/UserList.tsx";

const LeftColumn = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("")

    return (
        <div className={'left-column-wrapper'}>
            <LeftMainHeader action={() => setIsMenuOpen(!isMenuOpen)} searchOnChange={setSearchValue}/>
            {searchValue.trim().length > 0 ? <UserList searchValue={searchValue}/> : <ChatList/>}
            <LeftMenu state={isMenuOpen} action={() => setIsMenuOpen(false)} />
        </div>
    )
}

export default LeftColumn
