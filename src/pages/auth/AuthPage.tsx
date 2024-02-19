import './authV2.scss';
import {useState} from "react";
import Register from "./Register.tsx";
import Login from "./Login.tsx";
import Icon, {AppIcons} from "../../components/common/icon/Icon.tsx";
import {useNavigate, useParams} from "react-router-dom";
import CustomButton, {ButtonStyles} from '../../components/common/customButton/CustomButton.tsx';

const AuthPage = () => {
    const navigate = useNavigate();
    const { action } = useParams();
    const [isRightPanelActive, setIsRightPanelActive] = useState(action);

    const handleSignUpClick = () => {
        navigate('/auth/registration',{replace:true});
        setIsRightPanelActive("registration");
    };

    const handleSignInClick = () => {
        navigate('/auth/login',{replace:true});
        setIsRightPanelActive("login");
    };

    return (
        <div className={'container-test'}>
            <div className={`containerV2 ${isRightPanelActive==="registration" ? "right-panel-active" : ""}`} id="container">
                <div className={"back-button"}>
                    <Icon icon={AppIcons.back} onClick={() => navigate("/")} />
                </div>
                <div className="form-container sign-up-container">
                    <Register action={()=> handleSignInClick()}/>
                </div>
                <div className="form-container sign-in-container">
                    <Login/>
                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>С возвращением!</h1><br />
                            <p>Чтобы оставаться на связи с нами, пожалуйста, войдите в систему, указав свои личные данные</p>
                            <CustomButton className={"submit-buttonV2"} style={ButtonStyles.outlinedButtonDefault}  onClick={() => handleSignInClick()}>
                                Вход
                            </CustomButton>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Привет, друг!</h1> <br />
                            <p> Введите свои личные данные и начните общение с кем либо!</p>
                            <CustomButton className={"submit-buttonV2"} style={ButtonStyles.outlinedButtonDefault}  onClick={() => handleSignUpClick()}>
                                Зарегистрироваться
                            </CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
