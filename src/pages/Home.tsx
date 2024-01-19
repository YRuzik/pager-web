import './home.scss'
import ChatList from "../components/home/chatList/ChatList.tsx";
import ChattingWindow from "../components/home/chattingWindow/ChattingWindow.tsx";

const Home = () => {
    // const [init, setInit] = useState(true)
    // const handleStreams = useCallback(
    //     () => {
    //         initializeStreams(init).then((value) => {
    //             if (value) {
    //                 setInit(false)
    //             }
    //         })
    //     }, [init]
    // )
    // useEffect(() => {
    //     handleStreams()
    // }, [handleStreams])

    return (
        <div className={"home-wrapper"}>
            <div className={"home-chat-list-container"}>
                <ChatList/>
            </div>
            <div className={"home-chat-container"}>
                <ChattingWindow/>
            </div>
        </div>
    )
}

export default Home