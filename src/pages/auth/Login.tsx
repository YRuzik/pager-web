import {ErrorMessage, Field, Form, Formik} from "formik";
import "./AuthStyle.scss"
import {useAuth} from "../../hooks/useAuth.tsx";
import * as Yup from "yup";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

function Login() {
    const {login} = useAuth();
    const navigate = useNavigate();
    const initialValues = {
        identity: '',
        password: '',
    };

    const validationSchema = Yup.object({
        identity: Yup.string().required('Это поле обязательно для заполнения'),
        password: Yup.string()
            .required('Это поле обязательно для заполнения')
            .min(6, 'Пароль слишком короткий')
            .matches(/^[a-zA-Z0-9]+$/, 'Используйте только латинские буквы и цифры')
    });
    const handleLogin = async (identity: string, password: string) => {
        await login(identity, password).catch((e) => toast.error(e)).then(() => navigate("/chat"))
    };
    return (
        <div className={'container'}>
            <div className={'container-item'}>
                <div className={"form-header"}>Вход</div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        await handleLogin(values.identity, values.password);
                    }}
                >
                    {({isSubmitting, isValid, dirty}) => (
                        <Form>
                            <div className={'email-container'}>
                                Логин / Почта
                                <Field type="identity" name="identity" className="form-field"/>
                                <ErrorMessage name="identity" component="div" className="ErrorMessages"/>
                            </div>
                            <div className={"password-container"}>
                                Пароль
                                <Field type="password" name="password" className="form-field"/>
                                <ErrorMessage name="password" component="div" className="ErrorMessages"/>
                            </div>
                            <div className={"container-temp"}>
                                <button className={"submit-button"}
                                        type="submit"
                                        disabled={!(isValid && dirty) || isSubmitting}
                                >
                                    {isSubmitting ? 'Загрузка...' : 'Войти'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Login