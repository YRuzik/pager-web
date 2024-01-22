import "./main.scss"
import logo from "../assets/pager.png"
import Modal from "../components/auth/modal.tsx";
import {useState} from "react";

export function MainPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [modalForm,setModalForm] = useState("")
    const handleOpenModal = (form:string) => {
        setIsOpen(true);
        setModalForm(form)
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }
    return (
        <div>
            <header className={"header-main-page"}>
                <img className={"logo-header"} src={logo} alt={'logo'}/>
                <div className={"span-name-header"}>Pager</div>
                <span className={"auth-wrapper"}>
                    <button onClick={() => handleOpenModal('register')}>Регистрация</button>
                    <button onClick={() => handleOpenModal('login')}>Авторизация</button>
                    {isOpen && <Modal open={isOpen} onClose={handleCloseModal} LoginRegisterFrom={modalForm}/>}
                </span>
            </header>
            <span className={"main-slogan"}>
                Будь частью разговора, будь частью истории. Мессенджер, где твои слова - ключ к захватывающему общению!
            </span>
            <text className={"main-slogan-text"}>
                Pager - <br/>облегчите общение с кем угодно!
            </text>
        </div>
    );
}