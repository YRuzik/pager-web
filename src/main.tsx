import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.scss'
import './styles/main.scss'
import {AuthProvider} from "./hooks/useAuth.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthProvider>
    <App />,
    </AuthProvider>
)
