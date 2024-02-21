import "./main.scss"
import logo from "../../assets/logo.svg"
import {Link} from "react-router-dom";
import mainImg from '../../assets/mainImg.png'
import Icon, {AppIcons} from "../../components/common/icon/Icon.tsx";

export function MainPage() {
    return (
        <div className={'main-container'}>
            <header className={"header-main-page"}>
                <img className={"logo-header"} src={logo} alt={'logo'}/>
                <div className={"span-name-header"}>Pager</div>
                <span className={"auth-wrapper"}>
                        <Link to={'/auth/login'} className={'login-link'}>Авторизация</Link>
                        <Link to={'/auth/registration'} className={"registration-link"}>Регистрация</Link>
                </span>
            </header>
            <span className={"main-slogan"}>
                Будь частью разговора, будь частью истории. Мессенджер, где твои слова - ключ к захватывающему общению!
            </span>
            <div className={"main-slogan-text"}>
                Pager - <br/>облегчите общение с кем угодно!
            </div>
            <div className={"background-present"}>
                <div className={'chats-image'}>
                    <img src={mainImg} alt={"demo chats"}/>
                </div>
            </div>
            <div className={'feature-wrapper'}>
                    <div className={'feature-card'}>
                        <Icon icon={AppIcons.stream} size={75}/>
                        <span>
                        Чаты в реальном времени
                   </span>
                        <h2>
                            Отправляйте и получайте сообщения в реальном времени без перезагрузки
                        </h2>
                    </div>
                <div className={'feature-card'}>
                    <Icon icon={AppIcons.ChatIcon} size={75}/>
                    <span>
                       Чаты сохранены
                   </span>
                    <h2>
                        Не беспойкойтесь вы всегда можете увидеть что вы писали год назад своему другу или родственнику
                    </h2>
                </div>
                <div className={'feature-card'}>
                    <Icon icon={AppIcons.apps} size={75}/>
                   <span>
                        Чаты расширяются!
                   </span>
                    <h2>
                        Следите за обновлениями, скоро вы получите больше возможностей над своими сообщениями
                    </h2>
                </div>
            </div>
            <div className={'FAQ-container'}>
                <div className={'FAQ-wrapper'}>
                    <h1>Общаться легко!</h1>
                    <h2>
                        Наш мессенджер предоставляет уникальные возможности для общения с друзьями, коллегами и близкими, при этом сохраняя вашу частную жизнь.<br/>
                        Выполните данные пункты и начните свое захватывающее общение с Pager, мессенджера, который делает общение простым и увлекательным.
                    </h2>
                    <ul>
                     <li><Link to={'/auth/registration'} style={{textDecoration:"underline"}}>  Зарегистрируйте</Link> новый аккаунт в Pager! </li>
                        <li>Зайдите в свой аккаунт.</li>
                        <li>С помощью поиска найдите с кем поболтать.</li>
                        <li>Начинайте общение!</li>
                    </ul>
                </div>
                    <img className={'FAQ-image'} alt={'chatting'} src={'https://img.freepik.com/free-vector/hand-drawn-flat-people-talking_23-2149060076.jpg?w=826&t=st=1707051192~exp=1707051792~hmac=0dcfa33bcf8e797680f2f57469719ff4557beebed0828b0c38140b558721c4e6'}/>
            </div>
            <footer className={'footer'}>
                <h1 className={"span-name-header"}>Pager</h1>
                <h2 className={"span-name-header"}> 2024г.<br/> Над проектом трудились Андрей и Евгений)</h2>
            </footer>
        </div>
    );
}