import "./main.scss"
import logo from "../assets/logo.svg"
import {Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.tsx";

export function MainPage() {
    const {authed,logout} = useAuth();
    return (
        <div>
            <header className={"header-main-page"}>
                <img className={"logo-header"} src={logo} alt={'logo'}/>
                <div className={"span-name-header"}>Pager</div>
                <span className={"auth-wrapper"}>
                    {!authed && <>
                        <Link to={'/registration'}>Регистрация</Link>
                        <Link to={'/login'}>Авторизация</Link> </>}
                    {authed && <button onClick={() => logout()}>Выйти</button>}
                </span>
            </header>
            <span className={"main-slogan"}>
                Будь частью разговора, будь частью истории. Мессенджер, где твои слова - ключ к захватывающему общению!
            </span>
            <div className={"main-slogan-text"}>
                Pager - <br/>облегчите общение с кем угодно!
            </div>
            <div className={"background-present"}></div>
        </div>
    );
}