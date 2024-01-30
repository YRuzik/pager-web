import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import './styles/main.scss'
import {StrictMode} from "react";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
