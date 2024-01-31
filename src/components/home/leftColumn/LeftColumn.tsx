
import './leftColumn.scss'
import LeftMainHeader from "../leftMainHeader/LeftMainHeader.tsx";
import ChatList from "../chatList/ChatList.tsx";
import {useState} from "react";
import UserList from "../userList/UserList.tsx";
const LeftColumn = () => {
    const [searchValue, setSearchValue] = useState("")
    return (
        <div className={'left-column-wrapper'}>
            <LeftMainHeader searchOnChange={setSearchValue}/>
            {(searchValue.length > 0) ? <UserList searchValue={searchValue}/> : <ChatList/>}
        </div>
    )
}

export default LeftColumn