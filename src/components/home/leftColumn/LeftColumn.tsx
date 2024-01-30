
import './leftColumn.scss'
import LeftMainHeader from "../leftMainHeader/LeftMainHeader.tsx";
import ChatList from "../chatList/ChatList.tsx";
const LeftColumn = () => {
    return (
        <div className={'left-column-wrapper'}>
            <LeftMainHeader/>
            <ChatList/>
        </div>
    )
}

export default LeftColumn