import './App.css'
import TestComponent from "./components/testComponent/TestComponent.tsx";
import {useEffect, useState} from "react";
import {streamHandler} from "./data/streams.ts";
import {StreamsApi} from "./data/api.ts";
import {ChatStreamRequest} from "./proto/transfers/streams.ts";

function App() {
    const [init, setInit] = useState(true)
  useEffect(() => {
      streamHandler<ChatStreamRequest>(init, () => setInit(!init), StreamsApi.streamChat.bind(StreamsApi), {chatId: "sdfsdf"})
      // testStream(init, () => setInit(false))
  }, [init])
  return (
    <>
      <TestComponent/>
    </>
  )
}

export default App
